const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.js")
const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const generateToken = require("../middlewares/generateToken.js");
const { error } = require("console");


// ----------------------- signup ------------------------------

const signup = async (req, res) => {
  try {

    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let fileUrl = null;
    let fileID = null;

    if(req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder:"bank_statements",
      })

      fileUrl = result.secure_url;
      fileID = result.public_id;

      fs.unlinkSync(req.file.path)
    }

    
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      bankStatementUrl: fileUrl,
      bankStatementId: fileID,

    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ----------------------- login ------------------------------


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({ id:user._id , username:user.username})

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      bankStatementUrl: user.bankStatementUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ----------------------- Profile ------------------------------



const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ----------------------- Update Profile ------------------------------


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, phone, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: fullName,
        email,
        phone,
        profileImage,
      },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ----------------------- Replace CSV ------------------------------

const replaceStatement = async(req,res) => {
  let newFile;

  try {

    if(!req.file)
    {
      return res.status(400).json({message: "No file uploaded"})
    }
    newFile = req.file.path

    const userId = req.user.id;
    const user = await User.findById(userId)
    if(!user) {
      fs.unlinkSync(newFile)
      return res.status(404).json({message:"user not found"})
    }

    const oldStatementID = user.bankStatementId
    if(!oldStatementID) {
      fs.unlinkSync(newFile);
      return res.status(400).json({message:"Cannot Replace File: Original file ID is missing"})
    }

    const uploadNew = await cloudinary.uploader.upload(newFile, {
      resource_type: "raw",
      folder: "bank_statements",
      public_id: oldStatementID,
      overwrite: true
    });

    user.bankStatementUrl = uploadNew.secure_url;

    await user.save();

    res.status(200).json({
      message:"bank statement updated successfully",
      bankStatementUrl:user.bankStatementUrl,
    })
  }
  catch(err) {
    console.error("Error replacing bank statement:", error);
    res.status(500).json({message:"error replacing file : ",error:error.message});
  }
  finally {
    if (newFile) {
      fs.unlink(newFile, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }
  }
}



module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  replaceStatement
};

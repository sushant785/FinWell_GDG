import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [file, setFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!file) {
            alert("Please upload your bank statement CSV file!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("password", password);
            formData.append("file", file);

            const response = await fetch("http://127.0.0.1:5000/signup", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Optionally, redirect to login page
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("Error signing up:", error);
            alert("An error occurred while signing up");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-100">
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left Section */}
                <div className="md:w-1/2 bg-primary flex flex-col justify-center items-center p-8 text-white text-center">
                    <div className="mb-6">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">FinWell</h1>
                    <p className="text-lg">Your proactive behavioral finance coach.</p>
                    <p className="mt-4 max-w-sm">
                        Gain control of your financial future with personalized insights and coaching.
                    </p>
                </div>

                {/* Right Section */}
                <div className="md:w-1/2 flex justify-center items-center p-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-200">Phone</label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">Confirm Password</label>
                                <div className="mt-1 relative">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Bank Statement */}
                            <div>
                                <label htmlFor="bank-statement" className="block text-sm font-medium text-gray-200">
                                    Bank Statement (CSV)
                                </label>
                                <div className="mt-1 flex">
                                    <input
                                        id="bank-statement"
                                        name="bank-statement"
                                        type="file"
                                        accept=".csv"
                                        required
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="bank-statement"
                                        className="flex items-center gap-2 cursor-pointer w-full justify-center rounded-lg border border-gray-300 dark:border-gray-400 bg-background-light dark:bg-background-dark/50 px-4 py-3 text-lg text-white dark:text-white hover:bg-primary/20"
                                    >
                                        📎 Upload CSV
                                    </label>
                                    {file && <span className="ml-2 text-sm text-gray-200">{file.name}</span>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-200">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

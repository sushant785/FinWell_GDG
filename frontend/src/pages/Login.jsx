import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if(response.ok) 
      {
        console.log("Login successful", data);
        localStorage.setItem("token",data.token);
        navigate("/dashboard");
      } 

      else 
      {
        setError(data.error || "Login failed");
      }
    } 
    
    catch(err) {
      console.error("Error connecting to server:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-100">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section */}
        <div className="md:w-1/2 bg-primary flex flex-col justify-center items-center p-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">FinWell</h1>
          <p className="text-lg">Your proactive behavioral finance coach.</p>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center items-center p-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-3xl font-bold text-center text-white">
              Welcome Back
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input w-full rounded-lg px-4 py-3 text-lg text-white dark:text-white bg-background-light dark:bg-background-dark/50 border border-gray-300 dark:border-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input w-full rounded-lg px-4 py-3 text-lg text-white dark:text-white bg-background-light dark:bg-background-dark/50 border border-gray-300 dark:border-gray-400"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                Log In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-200">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { register } from "../../../services/authService";
import { Link } from "react-router-dom";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
 
        try {
            const user = await register(username, email, password);
            console.log("Registered:", user);
        } catch(error) {
            console.error(error);
        }
    }
    return (
        <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>  
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /> 
                </div>
               
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Create Account</button>
                <Link to="/login"> Already have an account? Login</Link>
            </form>
        </div>
    );
}

export default RegisterForm;
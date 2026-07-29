import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../../../services/authService";
import { Link } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
 
        try {
            const user = await login(email, password);
            console.log("Logged in:", user);
        } catch(error: unknown) {
            console.error(error);
        }
    }
    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
                <Link to="/register"> Create Account</Link>
            </form>
        </div>
    );
}




export default LoginForm;

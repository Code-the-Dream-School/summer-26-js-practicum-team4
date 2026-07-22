
function SignupForm() {
    return (
        <div className="signup-form">
            <h2>Sign Up</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
               
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Create Account</button>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default SignupForm;
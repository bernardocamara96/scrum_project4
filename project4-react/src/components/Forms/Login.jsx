import "./Login.css";
import userPNG from "../../assets/user-login.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
   const navigate = useNavigate();
   const handleSubmit = (e) => {
      e.preventDefault();
      navigate("/register", { replace: true });
   };
   return (
      <main>
         <form id="loginForm">
            <div className="banner">
               <img id="login-icon" src={userPNG} alt="IMG" />
               <p id="member-login-banner">Member Login</p>
            </div>
            <div className="content">
               <label id="username-label" htmlFor="username">
                  Username
               </label>
               <input type="text" name="username" id="username" maxLength="25" placeholder="Enter your username" />
               <div id="errorLogin"></div>
               <label id="password-label" htmlFor="password">
                  Password
               </label>
               <input type="password" name="password" id="password" maxLength="25" placeholder="Enter your password" />
               <input type="submit" id="login" value="Login" />
            </div>
         </form>
         <div id="signup">
            Don't have an account?{" "}
            <a id="a_registration" onClick={handleSubmit}>
               Sign up
            </a>
         </div>
      </main>
   );
}

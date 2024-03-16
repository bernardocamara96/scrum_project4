import "./RegisterForm.css";
import userPNG from "../../assets/user-login.png";

export default function RegisterForm({ type }) {
   return (
      <div id="register_container">
         <form id="registrationForm" action="index.html">
            <div className="banner">
               <img name="img_user" id="login-icon" src={userPNG} alt="IMG" />
               <p id="member-registration-banner">Member Registration</p>
            </div>
            <div className="content">
               {type === "productOwnerRegister" && (
                  <>
                     <label id="role-label" for="role-field">
                        Role
                     </label>
                     <select name="role" id="role-field"></select>
                  </>
               )}

               <label id="username-label" for="username-field">
                  Username
               </label>
               <input
                  type="text"
                  name="username"
                  id="username-field"
                  maxLength="25"
                  placeholder="Enter your username"
               />
               <label id="password-label" for="password-field">
                  Password
               </label>
               <input
                  type="password"
                  name="password"
                  id="password-field"
                  maxLength="25"
                  placeholder="Enter your password"
               />
               <label id="password-label2" for="password2-field">
                  Repeat Password
               </label>
               <input
                  type="password"
                  name="password2"
                  id="password2-field"
                  maxlength="25"
                  placeholder="Enter your password"
               />
               <label id="phone-label" for="phone-field">
                  Phone
               </label>
               <input type="tel" name="phone" id="phone-field" maxlength="35" placeholder="Enter your phone" />
               <label id="email-label" for="email-field">
                  Email
               </label>
               <input type="email" name="email" id="email-field" maxlength="35" placeholder="Enter your email" />
               <label id="first-name-label" for="firstname-field">
                  First Name
               </label>
               <input
                  type="text"
                  name="firstname"
                  id="firstname-field"
                  maxlength="35"
                  placeholder="Enter your First Name"
               />
               <label id="last-name-label" for="lastname-field">
                  Last Name
               </label>
               <input
                  type="text"
                  name="lastname"
                  id="lastname-field"
                  maxlength="35"
                  placeholder="Enter your Last Name"
               />
               <label id="URL" for="photo-field">
                  Photography
               </label>
               <input type="text" name="photo" id="photo-field" maxlength="500" placeholder="Enter your Photo URL" />
               <input type="submit" id="registration" value="Registration" />
            </div>
         </form>
      </div>
   );
}

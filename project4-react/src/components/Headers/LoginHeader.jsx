import appLogo from "../../assets/logo.png";
import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
   const navigate = useNavigate();
   const handleClick = () => {
      navigate("/");
   };
   return (
      <header>
         <img id="logo" src={appLogo} onClick={handleClick} alt="IMG" />
      </header>
   );
}

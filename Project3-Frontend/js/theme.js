/**************************************************************************************************************************************************************************************/
/* THEME  */
/**************************************************************************************************************************************************************************************/
export function listenerThemeBtns() {
   document.addEventListener("DOMContentLoaded", function () {
      const darkThemeButton = document.getElementById("dark-theme");
      if (darkThemeButton) {
         darkThemeButton.addEventListener("click", () => changeTheme("theme-dark"));
      }
      const lightThemeButton = document.getElementById("light-theme");
      if (lightThemeButton) {
         lightThemeButton.addEventListener("click", () => changeTheme("theme-light"));
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* toggleTheme() = Toggle according set of colours for ROOT element
/**************************************************************************************************************************************************************************************/
export function toggleTheme() {
   let theme = sessionStorage.getItem("theme");
   let darkBtn = document.getElementById("dark-theme");
   let lightBtn = document.getElementById("light-theme");

   if (theme === "theme-dark") {
      console.log("now dark");
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
      if (darkBtn && lightBtn) {
         darkBtn.classList.add("active");
         lightBtn.classList.remove("active");
      }
   }
   if (theme === "theme-light") {
      console.log("now light");
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
      if (darkBtn && lightBtn) {
         lightBtn.classList.add("active");
         darkBtn.classList.remove("active");
      }
   }
}
/**************************************************************************************************************************************************************************************/
/* checkTheme(theme) = changes theme from button on click and... calls the toggleTheme
/**************************************************************************************************************************************************************************************/
export function changeTheme(theme) {
   if (theme) {
      // set no local storage.............. gravar lá
      sessionStorage.setItem("theme", theme); // saves data into sessionStorage
   }
   toggleTheme();
}
/**************************************************************************************************************************************************************************************/
/* initTheme() = loads up the previously set theme, if it exists, elsewise  defaults */
/*****************************************************************************d*********************************************************************************************************/
export function loadTheme() {
   let theme = sessionStorage.getItem("theme");

   if (theme === null) {
      // if it doesn't exist
      let theme = "theme-light"; // set it to theme-light as default
      sessionStorage.setItem("theme", theme); // save it
      console.log("Default theme was null. Default language is now set to: " + theme);
   }

   if (theme) {
      // set no local storage.............. gravar lá
      sessionStorage.setItem("theme", theme); // saves data into sessionStorage
   }
   toggleTheme();
}

/*
Requires: on .html -> both need to be type="module"
<script defer src="homepage.js" type="module"></script>
<script defer src="username.js" type="module"></script>

Requires on *main*.js
import { setUsername } from "./username.js";
...
setUsername();


*/

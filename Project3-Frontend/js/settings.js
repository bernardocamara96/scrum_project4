/* JavaScript File - all the code in the world  */
/* Switch to strict mode to get more useful errors
 when you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";

/**************************************************************************************************************************************************************************************/
/* adds listener to theme && language buttons */
/**************************************************************************************************************************************************************************************/
theme.listenerThemeBtns(); // adds listener to the theme buttons
language.listenerLanguageBtns(); // adds listener to the language buttons
/**************************************************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   photoUser.loadPhoto();
   accountDeletion();
});

/**************************************************************************************************************************************************************************************/
/* accountDeletion() - handles the form data fetch, compares password and error/confirmation boxes */
/**************************************************************************************************************************************************************************************/
function accountDeletion() {
   let delForm = document.getElementById("deleteForm"); // obtains the loginForm

   delForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let inputPassword = document.getElementById("passwordInput").value;
      let storagePassword = sessionStorage.getItem("password");
      if (inputPassword !== storagePassword) {
         alert(localizedStringWrongPass()); // alert only let's you press OK
      } else {
         if (confirmDeletion()) {
            let indexURL = "index.html";
            sessionStorage.clear(); // clears the whole thingy~
            window.location.href = indexURL; // returns to index/login page
         }
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* localizedStringWrongPass() - auxiliar function that returns a localized string with Wrong Password */
/**************************************************************************************************************************************************************************************/
function localizedStringWrongPass() {
   let lang = sessionStorage.getItem("language");
   if (lang === "pt") return "A palavra-passe está incorrecta!";
   return "The password is incorrect!";
}
/**************************************************************************************************************************************************************************************/
/* confirmDeletion() - triggers Language relevant confirmation box - */
/**************************************************************************************************************************************************************************************/
function confirmDeletion() {
   let lang = sessionStorage.getItem("language");
   let confirmMsg;
   if (lang === "pt") {
      confirmMsg = "Tem a certeza de que pretende apagar a sua conta?";
   } else {
      confirmMsg = "Are you sure you wish to delete your account?";
   }

   if (confirm(confirmMsg)) {
      // confirm let's you press OK or Cancel
      return true;
   } else {
      return false;
   }
}
/* alternative would be: "Unfortunately, there is no cross-browser support for opening a confirmation dialog that is not the default OK/Cancel pair.
The solution you provided uses VBScript, which is only available in IE.
I would suggest using a Javascript library that can build a DOM-based dialog instead.
Try Jquery UI: http://jqueryui.com/"*/

/**************************************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************************************/

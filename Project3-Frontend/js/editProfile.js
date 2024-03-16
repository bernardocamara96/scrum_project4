import * as validation from "./userFieldsValidation.js";
import * as fetchPhotoNameAndRedirect from "./fetchPhotoAndName.js";
import * as encryptation from "./encryptation.js";

let userData = null;

document.addEventListener("DOMContentLoaded", function () {
   const currentUserUsername = sessionStorage.getItem("username");
   const currentUserpassword = sessionStorage.getItem("password");
   fetchUserData(currentUserUsername, currentUserpassword);
   editProfileFormListner();
   editPasswordFormListner();
   addListenerPhotoLabel();
});

function addListenerPhotoLabel() {
   document.querySelector("#photo-field").addEventListener("input", function () {
      if (this.value == "") {
         document.querySelector("#login-icon").src = this.placeholder;
         document.querySelector("#login-icon2").src = this.placeholder;
      } else if (isValidURL(this.value)) {
         document.querySelector("#login-icon").src = this.value;
         document.querySelector("#login-icon2").src = this.value;
      } else {
         document.querySelector("#login-icon").src = this.placeholder;
         document.querySelector("#login-icon2").src = this.placeholder;
      }
   });
}
function isValidURL(url) {
   try {
      new URL(url);
      return true;
   } catch (error) {
      return false;
   }
}
function editProfileFormListner() {
   const editProfileForm = document.getElementById("editProfileForm");
   editProfileForm.addEventListener("submit", function (event) {
      // Previne o envio do formulário antes da validação
      event.preventDefault();
      // Se todas as validações passaram, permite o envio do formulário
      if (editUserisValid()) {
         editUserData();
      }
   });
}
function editPasswordFormListner() {
   const editPasswordForm = document.getElementById("editPasswordForm");
   editPasswordForm.addEventListener("submit", function (event) {
      // Previne o envio do formulário antes da validação
      event.preventDefault();
      // Se todas as validações passaram, permite o envio do formulário
      if (passwordIsValid()) {
         editPassword();
      }
   });
}
async function fetchUserData(username, password) {
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/userinfo", {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   })
      .then((response) => response.json())
      .then(function (response) {
         userData = response;
         completeFieldsWithData();
         console.log(userData);
      });
}
function completeFieldsWithData() {
   document.getElementById("login-icon").src = userData.photoURL;
   document.getElementById("login-icon2").src = userData.photoURL;
   document.getElementById("username-field").value = userData.username;
   document.getElementById("phone-field").placeholder = userData.phoneNumber;
   document.getElementById("email-field").placeholder = userData.email;
   document.getElementById("firstname-field").placeholder = userData.firstName;
   document.getElementById("lastname-field").placeholder = userData.lastName;
   document.getElementById("photo-field").placeholder = userData.photoURL;
}

function editUserisValid() {
   if (document.getElementById("phone-field") !== null && document.getElementById("phone-field").value !== "") {
      if (!validation.validatePhone()) {
         return false;
      }
   }
   if (document.getElementById("email-field") !== null && document.getElementById("email-field").value !== "") {
      if (!validation.validateEmail()) {
         return false;
      }
   }
   if (
      document.getElementById("firstname-field") !== null &&
      document.getElementById("firstname-field").value !== "" &&
      document.getElementById("lastname-field") !== null &&
      document.getElementById("lastname-field").value !== ""
   ) {
      if (!validation.validateName()) {
         return false;
      }
   }
   if (document.getElementById("photo-field") !== null && document.getElementById("photo-field").value !== "") {
      if (!validation.validatephotoURL()) {
         return false;
      }
   }

   return true;
}
function passwordIsValid() {
   if (!validation.validatePassword()) {
      return false;
   }
   return true;
}

async function editUserData() {
   let user = {};
   if (document.getElementById("phone-field").value !== "" && document.getElementById("phone-field").value !== null) {
      user.phoneNumber = document.getElementById("phone-field").value;
   }
   if (document.getElementById("email-field").value !== "" && document.getElementById("email-field").value !== null) {
      user.email = document.getElementById("email-field").value;
   }
   if (
      document.getElementById("firstname-field").value !== "" &&
      document.getElementById("firstname-field").value !== null
   ) {
      user.firstName = document.getElementById("firstname-field").value;
   }
   if (
      document.getElementById("lastname-field").value !== "" &&
      document.getElementById("lastname-field").value !== null
   ) {
      user.lastName = document.getElementById("lastname-field").value;
   }
   if (document.getElementById("photo-field").value !== "" && document.getElementById("photo-field").value !== null) {
      user.photoURL = document.getElementById("photo-field").value;
   }
   console.log(user);
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/edituserdata", {
      method: "PATCH",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(user),
   }).then(function (response) {
      if (response.status == 200) {
         fetchPhotoNameAndRedirect.fetchPhotoNameAndRedirect(sessionStorage.getItem("token"));
         alert("User data updated successfully");
         window.location.href = "editProfile.html";
      } else {
         alert("Error updating user data");
      }
   });
}
async function editPassword() {
   let userNewPassword = {
      password: encryptation.encryptPassword(document.getElementById("old-password-field").value),
      newPassword: encryptation.encryptPassword(document.getElementById("password-field").value),
   };
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/edituserpassword", {
      method: "POST",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(userNewPassword),
   }).then(function (response) {
      if (response.status == 200) {
         alert("User password updated successfully");
         window.location.href = "index.html";
         sessionStorage.removeItem("username");
         sessionStorage.removeItem("password");
         loocalStorage.removeItem("imageUrl");
      } else {
         alert("Error updating user password");
      }
   });
}

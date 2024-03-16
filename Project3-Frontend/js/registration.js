import * as validation from "./userFieldsValidation.js";
import * as encryptation from "./encryptation.js";

document.addEventListener("DOMContentLoaded", function () {
   let token = sessionStorage.getItem("token");
   let role = sessionStorage.getItem("role");
   if (token && role === "productOwner") {
      createRoleOptions();
   } else {
      document.getElementById("role-field").hidden = true;
      document.getElementById("role-field").disabled = true;
      document.getElementById("role-label").hidden = true;
   }
});

document.addEventListener("DOMContentLoaded", function () {
   const registrationForm = document.getElementById("registrationForm");

   registrationForm.addEventListener("submit", function (event) {
      // Previne o envio do formulário antes da validação
      event.preventDefault();
      // Se todas as validações passaram, permite o envio do formulário
      if (isValid()) {
         addUser(registrationForm);
      }
   });
});

function createRoleOptions() {
   let option1 = document.createElement("option");
   option1.value = "developer";
   option1.text = "Developer";
   let option2 = document.createElement("option");
   option2.value = "scrumMaster";
   option2.text = "Scrum Master";
   let option3 = document.createElement("option");
   option3.value = "productOwner";
   option3.text = "Product Owner";
   document.getElementById("role-field").appendChild(option1);
   document.getElementById("role-field").appendChild(option2);
   document.getElementById("role-field").appendChild(option3);
   document.getElementById("role-field").hidden = false;
   document.getElementById("role-field").disabled = false;
   document.getElementById("role-label").hidden = false;
}

document.querySelector("#photo-field").addEventListener("input", function () {
   console.log(isValidURL(this.value));
   if (isValidURL(this.value)) document.querySelector("#login-icon").src = this.value;
   else document.querySelector("#login-icon").src = "images/user-login.png";
});

function isValidURL(url) {
   try {
      new URL(url);
      return true;
   } catch (error) {
      return false;
   }
}

document.querySelector("#logo").addEventListener("click", function () {
   let token = sessionStorage.getItem("token");
   let role = sessionStorage.getItem("role");
   if (token && role === "productOwner") {
      window.location.href = "projectSettingsUsers.html";
   } else window.location.href = "index.html";
});

function isValid() {
   if (!validation.validateUsername()) {
      return false;
   }
   if (!validation.validatePassword()) {
      return false;
   }
   if (!validation.validatePhone()) {
      return false;
   }
   if (!validation.validateEmail()) {
      return false;
   }
   if (!validation.validateName()) {
      return false;
   }
   if (!validation.validatephotoURL()) {
      return false;
   }
   return true;
}

async function addUser(form) {
   let user = {
      id: "0",
      username: form.username.value,
      password: encryptation.encryptPassword(form.password.value),
      phoneNumber: form.phone.value,
      email: form.email.value,
      firstName: form.firstname.value,
      lastName: form.lastname.value,
      photoURL: form.img_user.src
   };
   if(form.role.value === "" || form.role.value === null)user.role = "developer";
   else user.role = form.role.value;

   console.log(user);
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/add", {
      method: "POST",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
   }).then(function (response) {
      if (response.status == 200) {
         alert("user is added successfully :)");
         let token = sessionStorage.getItem("token");
         let role = sessionStorage.getItem("role");
         if (token && role === "productOwner") {
            window.location.href = "projectSettingsUsers.html";
         } else window.location.href = "index.html";
      } else if (response.status == 409) {
         alert("username or email already exists :)");
      } else {
         alert("something went wrong :(");
      }
   });
}

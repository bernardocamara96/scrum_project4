/* JavaScript File - all the code that was written goes here  */
/* Switch to strict mode to get more useful errors, when/if you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";
import * as validation from "./userFieldsValidation.js";

let userData = null;

/**************************************************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   photoUser.loadPhoto();
   loadUsers();
   loadUserInfoPanel();
   editProfileFormListner();
   createRoleOptions();
   deletePermanetelyActListner();
   deleteTasksByUserActListner();
   disableButtons();
   initUserSearch();
   initMainClickListener();
   restrictButtonAccess();
});

/**************************************************************************************************************************************************************************************/
/* Submit Action Listner
/**************************************************************************************************************************************************************************************/

/*function navButtons() {
   document.querySelector("#difSettings-tasks").disabled = false;
   document.querySelector("#difSettings-users").disabled = true;
   document.querySelector("#difSettings-categories").disabled = false;
}*/

function editProfileFormListner() {
   const editProfileForm = document.getElementById("editProfileForm");
   editProfileForm.addEventListener("submit", function (event) {
      // Previne o envio do formulário antes da validação
      event.preventDefault();
      // Se todas as validações passaram, permite o envio do formulário
      if (editUserisValid()) {
         const username = document.getElementById("username-field").value;
         if (username !== null && username !== "") {
            editUserData(username);
         }
      }
   });
}

/**************************************************************************************************************************************************************************************/
/* function loadUsers - LOAD ALL Users */
/**************************************************************************************************************************************************************************************/
async function loadUsers() {
   const token = sessionStorage.getItem("token");

   // Verificar se o token
   if (!token) {
      console.log("Utilizador não está logado.");
      return; // Ou redirecionar para a página de login
   }

   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/all", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });

      if (response.ok) {
         const usersFromServer = await response.json(); // Assume que o backend retorna um array de users
         const users = usersFromServer;
         console.log(users);
         const sortedUsers = sortUsers(users);
         sortedUsers.forEach((user) => {
            if (user.username != "admin" && user.username != "devTest" && user.username != "deletedTasks")
               addUserToList(user);
         });
      } else {
         window.location.href = "index.html";
         console.error("Falha ao carregar Utilizadores:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar Utilizadores:", error);
   }
}

function sortUsers(users) {
   return users.sort((a, b) => {
      // Se a.deleted for true e b.deleted false, a deve vir depois de b
      if (a.deleted && !b.deleted) {
         return 1;
      }
      // Se b.deleted for true e a.deleted false, a deve vir antes de b
      if (b.deleted && !a.deleted) {
         return -1;
      }
      // Se ambos têm o mesmo estado (ambos deletados ou ambos não deletados), mantém a ordem original
      return 0;
   });
}
function initUserSearch() {
   const searchInput = document.getElementById("userSearch");
   searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const userListItems = document.querySelectorAll(".user-item");

      userListItems.forEach((item) => {
         const userName = item.getAttribute("data-user-id").toLowerCase();
         if (userName.includes(searchTerm)) {
            item.style.display = "";
         } else {
            item.style.display = "none"; // Esconde o item se não corresponder à pesquisa
         }
      });
   });
}
/**************************************************************************************************************************************************************************************/
/* function addTaskToRightList - ADD TASKS TO THE RIGHT LIST */
/**************************************************************************************************************************************************************************************/
function addUserToList(user) {
   /* <li> list items */
   const itemList = document.createElement("li"); // Creates a new <li> element
   itemList.setAttribute("data-user-id", user.username);
   itemList.classList.add("user-item");
   itemList.setAttribute("data-firstName", user.firstName);

   if (document.querySelector("#username-field").value === user.username) {
      itemList.style.boxShadow = "0px 0px 1px 3px rgba(5, 16, 46, 0.9)";
   }

   const itemName = document.createElement("h3");
   itemName.textContent = user.username;
   const userPhotoDiv = document.createElement("div");
   userPhotoDiv.classList.add("user-photo-div");
   const itemPhoto = document.createElement("img");
   itemPhoto.id = "userPhoto";
   itemPhoto.src = user.photoURL;

   // Criação do elemento para a role do utilizador
   const userRoleDiv = document.createElement("div");
   userRoleDiv.classList.add("user-role");
   if (user.role === "developer") userRoleDiv.textContent = "Developer";
   if (user.role === "scrumMaster") userRoleDiv.textContent = "Scrum Master";
   if (user.role === "productOwner") userRoleDiv.textContent = "Product Owner";

   /* Creating div's */
   const bannerDiv = document.createElement("div");
   console.log(user.deleted);
   if (user.deleted) {
      bannerDiv.classList.add("deleted-banner");
      bannerDiv.setAttribute("data-deleted", "true");
   } else {
      bannerDiv.classList.add("banner");
      bannerDiv.setAttribute("data-deleted", "false");
   }
   bannerDiv.appendChild(itemName);
   const contentDiv = document.createElement("div");
   contentDiv.classList.add("content");
   contentDiv.id = "usercard-content";
   contentDiv.appendChild(itemPhoto);
   contentDiv.appendChild(userRoleDiv);

   /* Append Title and Description to Task */
   itemList.appendChild(bannerDiv);
   itemList.appendChild(contentDiv);

   const role = sessionStorage.getItem("role");
   if (role === "scrumMaster" || role === "productOwner") {
      createClickActionList(itemList);
   }

   /* Add Task to correct List */
   document.getElementById("User_COLUMN").appendChild(itemList);
}

function loadUserInfoPanel() {
   const role = sessionStorage.getItem("role");
   const infoDiv = document.getElementById("individual-user-info");
   let infoContent = document.createElement("div");
   console.log(role);

   if (role === "developer") {
      const infoTable = document.getElementById("content");
      infoTable.style.display = "none";
      let noPermissionsAlert = document.createElement("p");
      noPermissionsAlert.classList.add("user-individual-info-content");
      noPermissionsAlert.innerText = "You have no permission to see other users info";
      infoContent.appendChild(noPermissionsAlert);
   } else if (role === "scrumMaster") {
      const infoTable = document.getElementById("individual-user-info");
      const formElements = infoTable.querySelectorAll("input, button, select, textarea");
      document.getElementById("edit-submit").hidden = true;

      document.getElementById("delete-permanently").hidden = true;
      document.getElementById("delete-permanently").disabled = true;
      document.getElementById("delete-task-by-user").hidden = true;
      document.getElementById("delete-task-by-user").disabled = true;
      document.getElementById("add-user").hidden = true;
      document.getElementById("add-user").disabled = true;

      
      
      
      
      formElements.forEach(function (element) {
         element.disabled = true;
      });
   } else if (role === "productOwner") {
      const submitBTN = document.getElementById("edit-submit");
   }
   infoDiv.appendChild(infoContent);
}

/**************************************************************************************************************************************************************************************/
/* ADD ACTION LISTENERS TO THE EACH TASK ITEM - Only on the task-item excluding buttons 
/**************************************************************************************************************************************************************************************/
function createClickActionList(itemList) {
   itemList.addEventListener("click", function (event) {
      enableButtons();
      document.getElementById("individual-user-info").style.display = "block"; // Mostrar o formulário
      document.getElementById("editProfileForm").style.backgroundImage = "none"; // Esconder a imagem
      const userItems = document.querySelectorAll(".user-item");
      userItems.forEach((item) => {
         item.style.boxShadow = "0px 0px 0px 0px";
      });
      this.style.boxShadow = "0px 0px 1px 3px rgba(5, 16, 46, 0.9)";
      // Se um task-item for clicado
      const userId = itemList.getAttribute("data-user-id");
      fetchUserDataByUsername(userId);
   });
}
function displayTheBackgroudForm() {
   document.getElementById("individual-user-info").style.display = "none"; // Mostrar o formulário
   document.getElementById("editProfileForm").style.backgroundImage = "url('./images/placeholderform.png')";
}
function initMainClickListener() {
   const mainElement = document.querySelector("main");

   mainElement.addEventListener("click", function (event) {
      // Verifica se o clique ocorreu fora dos elementos 'user-item'
      if (!event.target.closest(".user-list, #centralform, .other-options-user")) {
         displayTheBackgroudForm();
      }
   });
}
async function fetchUserDataByUsername(username) {
   await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/user/userinfo/${username}`, {
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

function clearUserData() {
   document.getElementById("username-field").value = "";
   document.getElementById("phone-field").value = "";
   document.getElementById("email-field").value = "";
   document.getElementById("firstname-field").value = "";
   document.getElementById("lastname-field").value = "";
   document.getElementById("photo-field").value = "";
   document.getElementById("role-field").value = "developer";
   document.getElementById("phone-field").placeholder = "Enter your phone";
   document.getElementById("email-field").placeholder = "Enter your email";
   document.getElementById("firstname-field").placeholder = "Enter your First Name";
   document.getElementById("lastname-field").placeholder = "Enter your Last Name";
   document.getElementById("photo-field").placeholder = "Enter your Photo URL";
}
function completeFieldsWithData() {
   clearUserData();

   document.getElementById("username-field").value = userData.username;
   document.getElementById("phone-field").placeholder = userData.phoneNumber;
   document.getElementById("email-field").placeholder = userData.email;
   document.getElementById("firstname-field").placeholder = userData.firstName;
   document.getElementById("lastname-field").placeholder = userData.lastName;
   document.getElementById("photo-field").placeholder = userData.photoURL;
   document.getElementById("role-field").value = userData.role;
   const isTempDeleted = userData.deleted;
   console.log(isTempDeleted);
   if (isTempDeleted) document.getElementById("inactivate-field").value = "true";
   else document.getElementById("inactivate-field").value = "false";
   const userImage = document.getElementById("userImage");
   if (userData.photoURL) {
      // Verifica se existe uma URL de foto
      userImage.src = userData.photoURL;
   } else {
      userImage.src = "images/placeholder.png"; // Caminho para uma imagem padrão se não houver foto
   }
}
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
}

/**************************************************************************************************************************************************************************************/
/* User fields validation  
/**************************************************************************************************************************************************************************************/
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

/**************************************************************************************************************************************************************************************/
/* User Edition Fetch  
/**************************************************************************************************************************************************************************************/
async function editUserData(username) {
   let user = {
      role: document.getElementById("role-field").value,
      deleted: document.getElementById("inactivate-field").value,
   };


   document.querySelectorAll(".user-item").forEach((userDiv) => {
      if (userDiv.firstChild.innerText == username) {
         if (document.getElementById("inactivate-field").value !== userDiv.firstChild.getAttribute("data-deleted")) {
 
            if (document.getElementById("inactivate-field").value === "true") {
               userDiv.firstChild.classList.remove("banner");
               userDiv.firstChild.classList.add("deleted-banner");
            } else {
               userDiv.firstChild.classList.remove("deleted-banner");
               userDiv.firstChild.classList.add("banner");
            }
         }
      }
   });

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
   const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/editotheruser", {
      method: "PATCH",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
         userToChangeUsername: username,
      },
      body: JSON.stringify(user),
   });
   if (response.status == 200) {
  
      alert("User edited successfully");

      clearAllUserElements();
      await loadUsers();

      await fetchUserDataByUsername(username);
   } else {
      alert("Error updating user data");
   }
}

function clearAllUserElements() {
   const userContainer = document.getElementById("User_COLUMN");
   if (userContainer) {
      while (userContainer.firstChild) {
         userContainer.removeChild(userContainer.firstChild);
      }
   }
}
function deletePermanetelyActListner() {
   document.getElementById("delete-permanently").addEventListener("click", function () {
      if (confirm("Do you want to delete this user permanently?")) {
         const token = sessionStorage.getItem("token");
         const role = sessionStorage.getItem("role");
         if (token && role === "productOwner") {
            deletePermanentlyUser(token, userData.username);
            clearUserData();
            disableButtons();
            const users = document.querySelectorAll(".user-item");

            users.forEach((user) => {
               console.log("userdate " + userData.username);
               console.log("child " + user.firstChild.textContent);
               if (user.getAttribute("data-user-id") === userData.username) {
                  user.remove();
               }
            });
         }
      }
   });
}

function enableButtons() {
   document.querySelector("#delete-permanently").disabled = false;
   document.querySelector("#delete-task-by-user").disabled = false;
}

function disableButtons() {
   document.querySelector("#delete-permanently").disabled = true;
   document.querySelector("#delete-task-by-user").disabled = true;
}

function deleteTasksByUserActListner() {
   document.getElementById("delete-task-by-user").addEventListener("click", function () {
      if (confirm("Do you want to delete all tasks from this user?")) {
         const token = sessionStorage.getItem("token");
         const role = sessionStorage.getItem("role");
         if (token && role === "productOwner") {
            deleteTasksByUser(token, userData.username);
         }
      }
   });
}

async function deletePermanentlyUser(token, userToDeleteUsername) {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/permanetelydelete", {
         method: "DELETE",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: token,
            userToDeleteUsername: userToDeleteUsername,
         },
      });

      if (!response.ok) {
         throw new Error(`Server responded with a status of ${response.status}`);
      }
      displayTheBackgroudForm();
      console.log("User deleted successfully.");
   } catch (error) {}
}
async function deleteTasksByUser(token, userToDeleteUsername) {
   try {
      const response = await fetch(
         `http://localhost:8080/tiago-bernardo-proj3/rest/task/deletetemp/all/${userToDeleteUsername}`,
         {
            method: "DELETE",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: token, // It's more typical to use an Authorization header, but we'll keep it as per your requirement
            },
         }
      );

      if (!response.ok) {
         // If the server response is not OK, throw an error
         throw new Error(`Server responded with a status of ${response.status}`);
      }

      alert("Tasks deleted successfully."); // Placeholder for success feedback
   } catch (error) {}
}
function restrictButtonAccess() {
   const role = sessionStorage.getItem("role");
   if (role !== "productOwner") {
      const buttons = document.querySelectorAll(".other-options-user button");
      buttons.forEach((button) => {
         button.disabled = true;
         button.style.color = "grey";
         button.style.cursor = "default";
         button.title = "Only available for Product Owners";
      });
      const addUserLink = document.querySelector("#add-user a");
      if (addUserLink) {
         addUserLink.removeAttribute("href");
         addUserLink.style.pointerEvents = "none";
         addUserLink.style.color = "grey";
         addUserLink.title = "Only available for Product Owners";
      }
   }
}

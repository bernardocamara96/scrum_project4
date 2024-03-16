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

/*************************************å*************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   photoUser.loadPhoto();
   loadTasks();
});

/*function navButtons() {
   document.querySelector("#difSettings-tasks").disabled = true;
   document.querySelector("#difSettings-users").disabled = false;
   document.querySelector("#difSettings-categories").disabled = false;
}*/

/**************************************************************************************************************************************************************************************/
/* function Tasks - LOAD ALL Tasks */
/**************************************************************************************************************************************************************************************/

async function loadTasks() {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/task/alldeleted", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });
      if (response.ok) {
         const tasksFromServer = await response.json();
         const tasks = tasksFromServer;
         tasks.forEach((task) => {
            addTaskToList(task);
         });
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar Tarefas:", error);
   }
}

function addTaskToList(task) {
   const itemList = document.createElement("li");
   itemList.setAttribute("data-task-id", task.id);
   itemList.classList.add("task-item-deleted");
   const status = task.status;
   if (status == 100) itemList.classList.add("eliminated-todo");
   if (status == 200) itemList.classList.add("eliminated-doing");
   if (status == 300) itemList.classList.add("eliminated-done");

   const itemName = document.createElement("h3");
   itemName.style.fontSize = "17px";

   if (task.title.length > 8) {
      itemName.textContent = task.title.substring(0, 8) + "..";
   } else {
      itemName.textContent = task.title;
   }
   const itemDescription = document.createElement("p");
   if (task.description.length > 32) {
      itemDescription.textContent = task.description.substring(0, 32) + "..";
   } else {
      itemDescription.textContent = task.description;
   }

   const category_author = document.createElement("div");
   category_author.classList.add("category_author");

   const itemAuthor = document.createElement("span");
   if (task.username_author == "deletedTasks") {
      itemAuthor.textContent = "Delet. User";
   } else itemAuthor.textContent = task.username_author.substring(0, 6);
   itemAuthor.style.marginRight = "20px";
   const itemCategory = document.createElement("span");
   itemCategory.textContent = task.category_type.substring(0, 6);

   category_author.appendChild(itemAuthor);
   category_author.appendChild(itemCategory);

   const bannerDiv = document.createElement("div");
   bannerDiv.classList.add("banner");
   const contentDiv = document.createElement("div");
   contentDiv.classList.add("content");
   bannerDiv.appendChild(itemName);
   bannerDiv.appendChild(category_author);
   contentDiv.appendChild(itemDescription);
   itemList.appendChild(bannerDiv);
   itemList.appendChild(contentDiv);
   userDeletePermissions(task.id, itemList, "task");
   document.querySelector("#DELETED_COLUMN").appendChild(itemList);
}

async function userDeletePermissions(taskId, itemList) {
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/permission/delete/${taskId}`, {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.ok) {
      const deleteBtn = document.createElement("button");
      const delIcon = document.createElement("img");
      delIcon.src = "images/trashCanIcon.png";
      delIcon.alt = "del";

      deleteBtn.appendChild(delIcon);
      itemList.appendChild(deleteBtn);
      const restaureBtn = document.createElement("button");
      restaureBtn.innerHTML = "&#9850;";
      addEventListener(deleteBtn, restaureBtn);
      itemList.appendChild(restaureBtn);
      clickOnTaskListner(itemList);
   } else {
      const errorMessage = await response.text();

      if (errorMessage === "Don't have permission to edit this task") {
      } else if (response.status == 400) {
         console.error("Task not found ");
         document.querySelector("#edit-icon").hidden = true;
      }
   }
}

function addEventListener(deleteBtn, restaureBtn) {
   deleteBtn.addEventListener("click", function () {
      if (confirm("Do you want to delete this task permanently?")) {
         const taskId = this.parentElement.getAttribute("data-task-id");
         deleteTask(taskId);
         this.parentElement.remove();
      }
   });
   restaureBtn.addEventListener("click", function () {
      if (confirm("Do you want to restore this task?")) {
         const taskId = this.parentElement.getAttribute("data-task-id");
         restaureTask(taskId);
         this.parentElement.remove();
      }
   });
}

function clickOnTaskListner(itemList) {
   itemList.addEventListener("click", function (event) {
      // Verificar se o clique foi diretamente num botão
      if (event.target.tagName === "BUTTON" || event.target.tagName === "IMG") {
         return; // Não faz nada se um botão foi clicado, permitindo que o evento do botão seja processado
      }

      let targetElement = event.target;
      //verifica qual o elemento pai que realmente corresponde ao um task-item
      while (targetElement != null && !targetElement.classList.contains("task-item-deleted")) {
         targetElement = targetElement.parentElement;
      }
      // Se um task-item for clicado
      if (targetElement && targetElement.classList.contains("task-item-deleted")) {
         const taskId = targetElement.getAttribute("data-task-id");
         window.location.href = `edittask.html?taskId=${taskId}`;
      }
   });
}

async function restaureTask(taskId) {
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/recycle/${taskId}`, {
      method: "PATCH",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
}
async function deleteTask(taskId) {
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/delete/${taskId}`, {
      method: "DELETE",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
}

document.getElementById('taskSearch').addEventListener('input', function(e) {
   const searchTerm = e.target.value.toLowerCase();
   filterTasksByTitle(searchTerm);
});

function filterTasksByTitle(searchTerm) {
   const tasks = document.querySelectorAll('.task-item-deleted');

   tasks.forEach(task => {
      const title = task.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchTerm)) {
         task.style.display = ''; 
      } else {
         task.style.display = 'none'; 
      }
   });
}

/* JavaScript File - all the code in the world  */
/* Switch to strict mode to get more useful errors
 when you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";
import * as validation from "./taskFieldsValidation.js";

let taskId = -1;

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
   writeAllCategories();
   loadTaskId();
   submitActionListnerCreation();
});
/**************************************************************************************************************************************************************************************/
/* DISPLAY TASK PART I - Finds task by ID - EDITTASK.HTML - fetches the Task that was passed through URL, finds it in sessionStorage JSON, and displays it */
/**************************************************************************************************************************************************************************************/

async function writeAllCategories() {
   const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/category/all", {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.ok) {
      const categories = await response.json();
      for (let i = 0; i < categories.length; i++) {
         let option = document.createElement("option");
         option.value = categories[i].type;
         option.text = categories[i].type.substring(0, 20);
         document.getElementById("category-type").appendChild(option);
      }
   }
}
async function loadTaskId() {
   const urlParams = new URLSearchParams(window.location.search);
   taskId = Number(urlParams.get("taskId"));
   console.log(taskId);

   if (!taskId) {
      console.error("Task ID is missing");
      return;
   }

   try {
      const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/${taskId}`, {
         method: "GET",
         headers: {
            Accept: "application/json",
            token: sessionStorage.getItem("token"),
         },
      });

      if (!response.ok) {
         throw new Error("Failed to fetch task details");
      }

      const task = await response.json();
      // Preenche os campos do formulário com os dados da tarefa
      if (task) {
         document.getElementById("title").value = task.title;
         document.getElementById("description").value = task.description;
         if (task.username_author == "deletedTasks") {
            document.getElementById("author-username").innerText = "Deleted User";
            document.getElementById("author-username").style.color = "red";
         } else document.getElementById("author-username").innerText = task.username_author.substring(0, 16);
         document.getElementById("priority").value = task.priority;
         document.getElementById("date-start").value = task.startDate ? task.startDate : "";
         document.getElementById("date-end").value = task.endDate ? task.endDate : "";
         userEditPermissions(task);
         addButton(task);
         for (let i = 0; i < document.getElementById("category-type").options.length; i++) {
            if (document.getElementById("category-type").options[i].value === task.category_type) {
               document.getElementById("category-type").options[i].selected = true;
               break;
            }
         }
      } else {
         console.error("Task not found");
      }
   } catch (error) {
      console.error("Error fetching task details:", error);
      alert("Network error or server is down. Please try again later.");
   }
}

async function addButton(task) {
   const taskId = task.id;
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/permission/edit/${taskId}`, {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.ok) {
      document.querySelector("#delete-task").hidden = false;
      document.querySelector("#delete-task").disabled = false;
   } else {
      const errorMessage = await response.text();
      if (errorMessage === "Don't have permission to edit this task") {
         // this one is always added
         document.querySelector("#delete-task").hidden = true;
         document.querySelector("#delete-task").disabled = true;
      } else if (response.status == 403) {
         window.location.href = "index.html";
      }
   }
}

async function deleteListener(taskId) {
   try {
      const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/deletetemp/${taskId}`, {
         method: "PATCH", // Método HTTP para deleção
         headers: {
            // Assume que a autenticação é feita via cabeçalhos 'username' e 'password'
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });
      if (response.ok) {
         alert("This task was successfully deleted");
         window.location.href = "homepage.html";
      } else {
         // Trata erros de resposta não-OK (ex., 401, 403, 404, etc.)
         console.error("Failed to delete task:", response.statusText);
         alert("Failed to delete task. Please try again.");
      }
   } catch (error) {
      // Trata erros de rede ou de comunicação com o servidor
      console.error("Network error when trying to delete task:", error);
      alert("Network error. Please check your connection and try again.");
   }
}

async function userEditPermissions(task) {
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/permission/edit/${task.id}`, {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });

   if (response.ok && task.deleted == false) {
      document.querySelector("#edit-icon").hidden = false;
      document.querySelector("#edit-btn").disabled = false;
      document.querySelector("#cancel-edit").addEventListener("click", function () {
         window.location.href = "homepage.html";
      });
      document.querySelector("#delete-task").addEventListener("click", function () {
         if (confirm("Are you sure you want to delete this task?")) {
            deleteListener(task.id);
         }
      });
      const inputs = document.querySelectorAll(".editable-onClick");
      document.querySelector("#edit-btn").addEventListener("click", function () {
         inputs.forEach(function (input) {
            input.disabled = false;
         });
         const savebtn = document.getElementById("save-task");
         savebtn.hidden = false;
         this.disabled = true;
      });
   } else if (response.ok && task.deleted == true) {
      document.querySelector("#edit-icon").hidden = true;
      document.querySelector("#edit-btn").disabled = true;
      createRestaureAndDeleteButtons(task.id);
      document.querySelector("#cancel-edit").addEventListener("click", function () {
         window.location.href = "projectSettingsTasksCategory.html";
      });
      const inputs = document.querySelectorAll(".editable-onClick");
      document.querySelector("#edit-btn").addEventListener("click", function () {
         inputs.forEach(function (input) {
            input.disabled = false;
         });
         const savebtn = document.getElementById("save-task");
         savebtn.hidden = false;
         this.disabled = true;
      });
   } else {
      const errorMessage = await response.text();

      if (errorMessage === "Don't have permission to edit this task") {
         document.querySelector("#edit-icon").hidden = true;
         document.querySelector("#edit-btn").disabled = true;
         document.querySelector("#cancel-edit").addEventListener("click", function () {
            window.location.href = "homepage.html";
         });
      } else if (response.status == 400) {
         console.error("Task not found ");
         document.querySelector("#edit-icon").hidden = true;
         document.querySelector("#edit-btn").disabled = true;
      } else if (response.status == 403) {
         window.location.href = "index.html";
      }
   }
}

document.querySelector("#taskForm-viewer-edition").addEventListener("submit", function (event) {
   event.preventDefault();
});

function createRestaureAndDeleteButtons(taskId) {
   const itemParent = document.querySelector(".row-back");
   const restaureButton = document.createElement("button");
   restaureButton.innerText = "Restaure";
   restaureButton.classList.add("row-back-buttons");

   itemParent.appendChild(restaureButton);

   restaureButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to restore this task?")) {
         restaureTask(taskId);
      }
   });

   document.querySelector("#delete-task").addEventListener("click", async function () {
      if (confirm("Are you sure you want to delete this task?")) {
         const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/delete/${taskId}`, {
            method: "DELETE",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         });
         if (response.status == 403) {
            window.location.href = "index.html";
         } else if (response.ok) {
            window.location.href = "projectSettingsTasksCategory.html";
         } else {
            console.error("Falha ao eliminar a tarefa:", response.statusText);
         }
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
   if (response.status == 403) {
      window.location.href = "index.html";
   } else if (response.ok) {
      window.location.href = "projectSettingsTasksCategory.html";
   } else {
      console.error("Falha ao restaurar a tarefa:", response.statusText);
   }
}

/**************************************************************************************************************************************************************************************/
/* DISPLAY TASK PART II - Interactivity - EDITTASK.HTML - adds the EDIT button and it's responsiveness, on 'click' it enables editing */
/**************************************************************************************************************************************************************************************/

/**************************************************************************************************************************************************************************************/
/* DISPLAY TASK  PART III - Save Changes  - EDITTASK.HTML - saves the task and returns to homepage */
/**************************************************************************************************************************************************************************************/
function submitActionListnerCreation() {
   const saveBtn = document.getElementById("save-task");

   saveBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Previne o comportamento padrão de submissão do formulário ...
      if (isValid()) {
         editTaskBE();
         const savebtn = document.getElementById("save-task");
         savebtn.hidden = true;
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* function saveTask() - saves the task into backend ::: finds previous occurence, replaces it and resaves */
/**************************************************************************************************************************************************************************************/
function isValid() {
   if (!validation.validateTitle()) {
      return false;
   }
   if (!validation.validateDescription()) {
      return false;
   }
   if (!validation.validateStartDateBeforeEndDate()) {
      return false;
   }
   if (!validation.validatePriority()) {
      return false;
   }
   return true;
}

async function editTaskBE() {
   console.log(document.getElementById("priority").value);
   let taskUpdates = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      category_type: document.getElementById("category-type").value,
   };
   const startDate = document.getElementById("date-start").value;
   const endDate = document.getElementById("date-end").value;
   // Inclui datas apenas se forem fornecidas e se não forem manda remover no back
   if (startDate && startDate !== "") taskUpdates.startDate = startDate;
   else taskUpdates.removeStartDate = true;
   if (endDate && endDate !== "") taskUpdates.endDate = endDate;
   else taskUpdates.removeEndDate = true;

   try {
      const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/edit/${taskId}`, {
         method: "PUT", // Usando PATCH para edição parcial
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
         body: JSON.stringify(taskUpdates),
      });

      if (response.ok) {
         alert("Task updated successfully :)");
         const inputs = document.querySelectorAll(".editable-onClick");
         inputs.forEach(function (input) {
            input.disabled = true;
         });
         const editButton = document.getElementById("edit-btn");
         editButton.disabled = false;
      } else {
         const errorMsg = await response.json();
         alert(`Failed to update task: ${errorMsg}`);
      }
   } catch (error) {
      console.error("Error updating task:", error);
      alert("Network error or server is down. Please try again later.");
   }
}

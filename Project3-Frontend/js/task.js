/* JavaScript File - all the code in the world  */
/* Switch to strict mode to get more useful errors
 when you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import { loadPhoto } from "./UserPhoto.js";
import * as validation from "./taskFieldsValidation.js";

const TODO_COLUMN = 100;

language.listenerLanguageBtns(); // adds listener to the language buttons
/**************************************************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   loadPhoto();
   submitActionLisnter();
   getAllCategories();
});

/**************************************************************************************************************************************************************************************/
/*  TASK SUBMISSION */
/**************************************************************************************************************************************************************************************/
function submitActionLisnter() {
   var form = document.getElementById("taskForm"); // obtem o forumulário de criação de uma task!
   form.addEventListener("submit", function (event) {
      //Adiciona actionListner em caso de submissão
      event.preventDefault(); // previne que o formulário seja enviado da forma default
      var title = document.getElementById("title").value; //obtem o titulo da task
      var description = document.getElementById("description").value; //obtem a descrição da task
      var priority = document.getElementById("priority").value;
      var startDate = document.getElementById("date-start").value;
      var endDate = document.getElementById("date-end").value;
      if (isValid()) {
         addTaskBE(title, description, priority, startDate, endDate);
      }
   });
}
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

/**************************************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************************************/

async function addTaskBE(title, description, priority, startDate, endDate) {
   const category_type = document.getElementById("category-type").value;
   let task = {
      // cria um objeto task
      title: title,
      description: description,
      priority: priority,
      status: TODO_COLUMN,
   };
   if (startDate) {
      task.startDate = startDate;
   }
   if (endDate) {
      task.endDate = endDate;
   }
   console.log(task);
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/task/create/" + category_type, {
      method: "POST",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(task),
   }).then(function (response) {
      if (response.status == 201) {
         alert("task is added successfully :)");
         window.location.href = "homepage.html";
      } else if (response.status == 401) {
         alert("username not loged in");
      } else if (response.status == 403) {
         alert("Acess Denied");
         window.location.href = "index.html";
      }
   });
}

async function getAllCategories() {
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
         option.text = categories[i].type.substring(0, 30);
         document.getElementById("category-type").appendChild(option);
      }
   }
}

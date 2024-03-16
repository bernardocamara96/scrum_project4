/* JavaScript File - all the code that was written goes here  */
/* Switch to strict mode to get more useful errors, when/if you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";

/**************************************************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   photoUser.loadPhoto();
   loadCategories();
   addCategoryEventListener();
});

/*function navButtons() {
   document.querySelector("#difSettings-tasks").disabled = false;
   document.querySelector("#difSettings-users").disabled = false;
   document.querySelector("#difSettings-categories").disabled = true;
}*/

/**************************************************************************************************************************************************************************************/
/* function Tasks - LOAD ALL Tasks */
/**************************************************************************************************************************************************************************************/

async function loadCategories() {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/category/all", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });
      if (response.ok) {
         const categoriesFromServer = await response.json();
         const categories = categoriesFromServer;
         document.querySelector("#DELETED_COLUMN").innerHTML = "";
         categories.forEach((category) => {
            addCategoriesToList(category);
         });
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar Categorias:", error);
   }
}

function addCategoriesToList(category) {
   const itemList = document.createElement("li");
   itemList.setAttribute("data-category-type", category.type);
   itemList.classList.add("task-item-deleted");
   itemList.classList.add("column-itemWidth");
   itemList.style.paddingTop = "10px";
   itemList.style.cursor = "auto";

   const itemTitle = document.createElement("input");
   itemTitle.value = category.type;
   itemTitle.classList.add("categoriesTitle-style");

   const contentDiv = document.createElement("div");
   contentDiv.classList.add("content");
   contentDiv.appendChild(itemTitle);
   itemList.appendChild(contentDiv);
   tasksByCategory(category.type, itemList);
   categoryDeletePermissions(itemList, itemTitle, contentDiv, category);

   document.querySelector("#DELETED_COLUMN").appendChild(itemList);
}

async function categoryDeletePermissions(itemList, itemTitle, contentDiv, category) {
   const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/category/permission", {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.ok) {
      itemTitle.disabled = false;
      const deleteBtn = document.createElement("button");
      const delIcon = document.createElement("img");
      delIcon.src = "images/trashCanIcon.png";
      delIcon.alt = "del";

      deleteBtn.appendChild(delIcon);

      itemList.appendChild(deleteBtn);
      const editBtn = document.createElement("button");
      editBtn.disabled = true;
      editBtn.classList.add("button-edit");
      editBtn.innerHTML = "&#128190;";
      editBtn.style.padding = " 0px";
      editBtn.style.borderRadius = "5px";
      itemTitle.addEventListener("input", function () {
         if (this.value !== category.type) {
            this.style.backgroundColor = "white";
            editBtn.disabled = false;
         } else {
            this.style.backgroundColor = "rgb(200, 200, 200)";
            editBtn.disabled = true;
         }
      });
      addEventListenerCategory(deleteBtn, editBtn);
      contentDiv.appendChild(editBtn);
   } else {
      itemTitle.disabled = true;
      document.querySelector("#btn_addCategory").disabled = true;
      document.querySelector("#categoryName").disabled = true;
      document.querySelector("#categoryName").hidden = true;
      document.querySelector("#btn_addCategory").hidden = true;
      console.error("Falha ao carregar Categorias:", response.statusText);
   }
}

function addEventListenerCategory(deleteBtn, editBtn) {
   deleteBtn.addEventListener("click", function () {
      if (confirm("Do you want to delete this category?")) {
         const categoryType = this.parentElement.getAttribute("data-category-type");
         console.log(categoryType);
         deleteCategory(categoryType, deleteBtn);
      }
   });
   editBtn.addEventListener("click", function () {
      const categoryType = this.parentElement.parentElement.getAttribute("data-category-type");
      const newCategoryType = this.parentElement.parentElement.firstChild.firstChild.value;
      if (newCategoryType !== null && newCategoryType !== "") {
         console.log(categoryType + "  " + newCategoryType);
         editCategory(categoryType, newCategoryType, editBtn);
      }
   });
}

async function editCategory(categoryType, newCategoryType, editBtn) {
   const response = await fetch(
      `http://localhost:8080/tiago-bernardo-proj3/rest/category/edit/${categoryType}/${newCategoryType}`,
      {
         method: "PATCH",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      }
   );
   if (response.status == 200) {
      alert("Category edited");
      editBtn.parentElement.parentElement.firstChild.firstChild.style.backgroundColor = "rgb(200, 200, 200)";
      editBtn.parentElement.parentElement.setAttribute("data-category-type", newCategoryType);
      loadCategories();
   } else if (response.status == 400) {
      editBtn.parentElement.parentElement.firstChild.firstChild.style.backgroundColor = "rgb(200, 200, 200)";
      alert("Category already exists");
      loadCategories();
   } else {
      console.error("Falha ao editar a categoria:", response.statusText);
   }
}

async function tasksByCategory(categoryType, itemList) {
   const response = await fetch(
      `http://localhost:8080/tiago-bernardo-proj3/rest/category/tasksnumber/${categoryType}`,
      {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      }
   );
   if (response.ok) {
      const numberFromServer = await response.json();
      const tasksNumber = numberFromServer;
      const number = document.createElement("span");
      number.textContent = tasksNumber;
      number.classList.add("numberOfTasks");
      itemList.appendChild(number);
   } else {
      console.error("Falha ao carregar Tarefas:", response.statusText);
   }
}
async function deleteCategory(categoryType, deleteBtn) {
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/category/delete/${categoryType}`, {
      method: "DELETE",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.status == 200) {
      console.log("Category eliminated");
      deleteBtn.parentElement.remove();
   } else if (response.status == 400) {
      alert("This category has tasks associated");
   } else {
      console.error("Falha ao restaurar a tarefa:", response.statusText);
   }
}

async function addCategoryEventListener() {
   document.querySelector("#btn_addCategory").addEventListener("click", async function () {
      console.log(23);
      const type = document.querySelector("#categoryName").value;
      if (type !== null && type !== "") {
         const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/category/add/${type}`, {
            method: "POST",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         })
            .then(function (response) {
               if (response.ok) {
                  alert("Category added");
                  document.querySelector("#categoryName").value = "";
                  return response.json();
               } else if (response.status == 400) {
                  alert("Category already exists");
               } else {
                  alert("Error adding category");
               }
            })
            .then((response) => {
               addCategoriesToList(response);
            });
      }
   });
}

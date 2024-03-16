function validateUsername() {
   // função que valida o username
   const username = document.getElementById("username-field").value;
   if (username.length < 2 || username.length > 25) {
      alert("Username must be between 2 and 25 characters.");
      return false;
   }
   return true;
}
function validatePassword() {
   const password = document.getElementById("password-field").value;
   const password2 = document.getElementById("password2-field").value;
   // Validar passwords
   if (password !== password2 || password.length < 4) {
      alert("Passwords must match and be at least 4 characters long.");
      return false;
   }
   return true;
}

function validateEmail() {
   const email = document.getElementById("email-field").value;
   // Validar email de maneira simples
   if (!email.includes("@") || !email.substring(email.indexOf("@")).includes(".")) {
      alert("Please enter a valid email address.");
      return false;
   }
   return true;
}
function validateName() {
   const firstName = document.getElementById("firstname-field").value;
   const lastName = document.getElementById("lastname-field").value;
   // Validar first name e last name
   if (firstName.length < 1 || firstName.length > 25 || lastName.length < 1 || lastName.length > 25) {
      alert("First name and last name must be between 1 and 25 characters.");
      return false;
   }
   return true;
}

function validatePhotoURL() {
   const photoURL = document.getElementById("photo-field").value;
   if (photoURL.length < 3 || photoURL.length > 500) {
      alert("Photo URL must be between 3 and 500 characters.");
      return false;
   }
   return true;
}

function isValidURL(url) {
   try {
      new URL(url);
      return true;
   } catch (error) {
      return false;
   }
}

function orderTasks(tasks) {
   tasks.sort((a, b) => {
      if (a.priority > b.priority) {
         return -1;
      } else if (a.priority < b.priority) {
         return 1;
      }

      // Handle initial dates
      if (a.startDate == undefined && b.startDate != undefined) {
         return 1;
      } else if (a.startDate != undefined && b.startDate === undefined) {
         return -1;
      } else if (a.startDate != undefined && b.startDate != undefined) {
         if (a.startDate < b.startDate) {
            return -1;
         } else if (a.startDate > b.startDate) {
            return 1;
         }
      }
      // Compare based on closest initial dates

      // Handle end dates
      if (a.endDate == undefined && b.endDate != undefined) {
         return 1;
      } else if (a.endDate != undefined && b.endDate == undefined) {
         return -1;
      } else if (a.endDate != undefined && b.endDate != undefined) {
         if (a.endDate < b.endDate) {
            return -1;
         } else if (a.endDate > b.endDate) {
            return 1;
         }
         // Compare based on closest end dates
      }

      return 0;
   });

   return tasks;
}

function validateTitle() {
   const title = document.getElementById("title").value;
   if (title.length < 2 || title.length > 20 || title === "" || title === null) {
      alert("Title must be between 2 and 20 characters.");
      return false;
   }
   return true;
}

function validateStartDateBeforeEndDate() {
   const startDate = document.getElementById("date-start").value;
   const endDate = document.getElementById("date-end").value;
   console.log(startDate + "    " + endDate);
   if (startDate !== null && endDate !== null && startDate !== "" && endDate !== "") {
      if (startDate > endDate) {
         alert("Start date must be before end date.");
         return false;
      }
   }
   return true;
}

function validatePriority() {
   const priority = document.getElementById("priority").value;
   if (priority < 1 || priority > 5) {
      alert("Priority must be between 0 and 400.");
      return false;
   }
   return true;
}

function validateStatus() {
   const status = document.getElementById("status").value;
   if (status < 0 || status > 100) {
      alert("Status must be between 0 and 400.");
      return false;
   }
   return true;
}

module.exports = {
   validateUsername,
   validatePassword,
   validateEmail,
   validateName,
   validatePhotoURL,
   isValidURL,
   orderTasks,
   validateTitle,
   validateStartDateBeforeEndDate,
   validatePriority,
   validateStatus,
};

export function validateTitle() {
   const title = document.getElementById("title").value;
   if (title.length < 2 || title.length > 20 || title === "" || title === null) {
      alert("Title must be between 2 and 20 characters.");
      return false;
   }
   return true;
}
export function validateDescription() {
   const description = document.getElementById("description").value;
   if (description.length < 2 || description.length > 400 || description === "" || description === null) {
      alert("Description must be between 2 and 180 characters.");
      return false;
   }
   return true;
}
export function validateStartDateBeforeEndDate() {
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

export function validatePriority() {
   const priority = document.getElementById("priority").value;
   if (priority < 1 || priority > 5) {
      alert("Priority must be between 0 and 400.");
      return false;
   }
   return true;
}
export function validateStatus() {
   const status = document.getElementById("status").value;
   if (status < 0 || status > 100) {
      alert("Status must be between 0 and 400.");
      return false;
   }
   return true;
}

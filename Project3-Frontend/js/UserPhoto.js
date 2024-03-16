export function loadPhoto() {
   const photoUrl = sessionStorage.getItem("photoUrl");
   if (photoUrl !== null) {
      const userPhoto = document.getElementById("userPhoto");
      userPhoto.setAttribute("src", photoUrl);
   }
}

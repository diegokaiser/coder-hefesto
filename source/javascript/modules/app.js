console.log("Desafío 2 por Diego Cáceres Cardoza ");
var elJsMenuTrigger = document.querySelector(".jsMenuTrigger");
var elMainMenu = document.querySelector(".mainMenu");
var elMenuTrigger = document.querySelector(".menuTrigger");

elJsMenuTrigger.onclick = function () {
  elJsMenuTrigger.classList.toggle("active");
  elMainMenu.classList.toggle("active");
  elMenuTrigger.classList.toggle("active");
};

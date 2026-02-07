const status = document.getElementById("status");
const btn = document.getElementById("btn");

status.textContent = "JavaScript loaded successfully";

btn.addEventListener("click", () => {
  alert("Button clicked. JS is working.");
});

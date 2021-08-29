const listContainer = document.querySelector(".list-container");
const list = document.querySelector(".list");
const inputListText = document.getElementById("list-text");
const buttonNew = document.getElementById("list-button_new");
const buttonRemove = document.getElementById("list-button_remove");


window.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
    let tarea = inputListText.value
    let li = document.createElement("LI");
    li.textContent = tarea
    li.classList = "li"
    if (tarea !== "") {
        list.appendChild(li)
        inputListText.value = ""
    } else {
        alert("No hay texto")
    }
}})

buttonNew.addEventListener("click", () => {
    let tarea = inputListText.value
    let li = document.createElement("LI");
    li.textContent = tarea
    li.classList = "li"
    if (tarea !== "") {
        list.appendChild(li)
        inputListText.value = ""
    } else {
        alert("No hay texto")
    }
})

buttonRemove.addEventListener("click", () => {
    let li = document.querySelector(".li")
    list.removeChild(li)
})

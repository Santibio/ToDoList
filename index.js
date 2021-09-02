"use strict";
// Defino los elementos del html
const listContainer = document.querySelector(".list-container");
const list = document.querySelector(".list");
const inputListText = document.getElementById("list-text");
const buttonNew = document.getElementById("list-button_new");
const buttonRemove = document.getElementById("list-button_remove");

// Creo la base de datos
const IDBResquest = indexedDB.open("List DB", 1);

IDBResquest.addEventListener("upgradeneeded", () => {
    const db = IDBResquest.result;
    db.createObjectStore("items", {
        autoIncrement: true
    })
})
IDBResquest.addEventListener("success", () => {
    console.log("The Data Base was seccessfully created")
    leerObjetos()
})
IDBResquest.addEventListener("error", () => { console.log("An error accurred") })


// Funciones de agregar a la list
document.querySelector(".btn-new-item").addEventListener("click", () => {
    let listText = document.getElementById("list-text").value;
    if (listText.length > 0) {
        if (document.querySelector(".enabled") != undefined) {
            if (confirm("Hay elementos sin guardar: ¿Quieres continuar?")) {
                addObjeto({ listText });
                leerObjetos()
            }
        } else {
            addObjeto({ listText });
            leerObjetos()
        }
    } else {
        alert("No ingreso la terea")
    }
    document.getElementById("list-text").value = ""
})

addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        let listText = document.getElementById("list-text").value;
        if (listText.length > 0) {
            if (document.querySelector(".enabled") != undefined) {
                if (confirm("Hay elementos sin guardar: ¿Quieres continuar?")) {
                    addObjeto({ listText });
                    leerObjetos()
                }
            } else {
                addObjeto({ listText });
                leerObjetos()
            }
        } else {
            alert("No ingreso la terea")
        }
        document.getElementById("list-text").value = ""
    }
})


// Creo las funciones relacionadas al Data Base

const addObjeto = objeto => {
    const IDBData = getIDBData("readwrite", "Item agregado correctamente");
    IDBData.add(objeto);
}

const leerObjetos = () => {
    const IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".list").innerHTML = ""
    cursor.addEventListener("success", () => {
        if (cursor.result) {
            let elemento = itemsHTML(cursor.result.key, cursor.result.value)
            fragment.appendChild(elemento)
            cursor.result.continue()
        } else document.querySelector(".list").appendChild(fragment)
    })
}

const modificarObjeto = (key, objeto) => {
    const IDBData = getIDBData("readwrite", "Item modificado correctamente");
    IDBData.put(objeto, key);
}
const eliminarObjeto = (key) => {
    const IDBData = getIDBData("readwrite", "Item eliminado correctamente");
    IDBData.delete(key);
}

const eliminarAllObjetos = () => {
    const IDBData = getIDBData("readwrite", "Item eliminado correctamente");
    IDBData.clear();
}

const getIDBData = (mode, msg) => {
    const db = IDBResquest.result;
    const IDBtransaction = db.transaction("items", mode);
    const objectStore = IDBtransaction.objectStore("items");
    IDBtransaction.addEventListener("complete", console.log(msg))
    return objectStore;
}

// Funciones relacionadas al DOM
const itemsHTML = (id, item) => {
    const container = document.createElement("DIV");
    const li = document.createElement("LI");
    const options = document.createElement("DIV");
    const saveButton = document.createElement("BUTTON");
    const deleteButton = document.createElement("BUTTON");
    // const deleteIcon = document.createElement("i");

    container.classList.add("item");
    options.classList.add("options");
    saveButton.classList.add("disable");
    deleteButton.classList.add("delete");

    saveButton.textContent = "Save";
    deleteButton.textContent = "Delete";

    li.textContent = item.listText;
    li.setAttribute("contenteditable", "true");
    li.setAttribute("spellcheck", "false");
    li.classList.add("li-item")

    // deleteIcon.classList.add("fas fa-edit");

    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    container.appendChild(li);
    container.appendChild(options);

    // deleteButton.appendChild(deleteIcon)


    li.addEventListener("keyup", () => {
        saveButton.classList.replace("disable", "enabled")
    })

    saveButton.addEventListener("click", () => {
        if (saveButton.className == "enabled") {
            modificarObjeto(id, { nombre: li.textContent });
            saveButton.classList.replace("enabled", "disable")
        }
    })

    deleteButton.addEventListener("click", () => {
        eliminarObjeto(id)
        leerObjetos()
    })
    return container
}

buttonRemove.addEventListener("click", () => {
    eliminarAllObjetos()
    leerObjetos()
})




/*  addEventListener("keypress", (e) => {
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
    }
})

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
})) */
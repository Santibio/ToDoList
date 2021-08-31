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
    const h2 = document.createElement("H2");
    const options = document.createElement("DIV");
    const saveButton = document.createElement("BUTTON");
    const deleteButton = document.createElement("BUTTON");

    container.classList.add("item");
    options.classList.add("options");
    saveButton.classList.add("disable");
    deleteButton.classList.add("delete");

    saveButton.textContent = "Save";
    deleteButton.textContent = "Delete";

    h2.textContent = item.item
    h2.setAttribute("contenteditable", "true");
    h2.setAttribute("spellcheck", "false");

    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    container.appendChild(h2);
    container.appendChild(options);

    h2.addEventListener("keyup", () => {
        saveButton.classList.replace("disable", "enabled")
    })

    saveButton.addEventListener("click", () => {
        if (saveButton.className == "enabled") {
            modificarObjeto(id, { nombre: h2.textContent });
            saveButton.classList.replace("enabled", "disable")
        }
    })

    deleteButton.addEventListener("click", () => {
        eliminarObjeto(id)
        leerObjetos()
    })
    return container
    }

    


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
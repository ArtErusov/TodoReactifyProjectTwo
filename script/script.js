"use strict";
const taskInput = document.querySelector(".form-container input");
const taskInputButton = document.querySelector(".form-container button");
const taskList = document.querySelector(".task-list"); 
const taskCompleted = document.querySelector(".info-tasks__state span"); 
const emptyTasks = document.getElementById('empty-tasks');
const sortButton = document.querySelector(".info-tasks__sort button");

import { deleteIconSVG } from "./deleteIconSVG.js";
import { editingTask, saveEditedTask } from "./editingTask.js";

let tasks = [];

// Загрузка задач из LocalStorage при инициализации
const loadTasks = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
};

// Сохранение задач в LocalStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};




// Отрисовка списка задач
const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskElement = document.createElement("li");
            taskElement.classList.toggle("completed", task.status);
            taskElement.addEventListener("click", () => editingTask(taskText, index, tasks));
            taskElement.setAttribute("draggable", "true"); // Делаем элемент перетаскиваемым
            taskElement.setAttribute("data-index", index);

            taskElement.addEventListener("dragstart", handleDragStart);
            taskElement.addEventListener("dragover", handleDragOver);
            taskElement.addEventListener("drop", handleDrop);
            taskElement.addEventListener("dragend", handleDragEnd);

        const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.status;
            checkbox.addEventListener("change", () => toggleTaskStatus(index));

        const taskText = document.createElement("p");
            taskText.textContent = task.text;
            // taskText.addEventListener("click", () => editingTask(taskText, index));

        const deleteButton = document.createElement("button");
            deleteButton.innerHTML = deleteIconSVG;
            deleteButton.addEventListener("click", () => deleteTask(index));

        taskList.appendChild(taskElement);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskText);
        taskElement.appendChild(deleteButton);  
    });
    saveTasks();
    taskCompleted.textContent = tasks.length ? `${tasks.filter(task => task.status === true).length} from ${tasks.length}` : '0';
    emptyTasks.classList.toggle("empty-tasks", tasks.length === 0);
    emptyTasks.classList.toggle("empty-tasks__none", tasks.length != 0);
};



// Сортировка
const sortStates = ["First: new tasks", "First: old tasks", "First: completed", "First: not completed"];
let currentSortIndex = 0;

function toggleSort() {
    currentSortIndex = (currentSortIndex + 1) % sortStates.length;
    sortButton.textContent = sortStates[currentSortIndex];;

    if(currentSortIndex === 0){
        tasks.sort((a, b) => b.timeAdded - a.timeAdded);
    }else if(currentSortIndex === 1) {
        tasks.sort((a, b) => a.timeAdded - b.timeAdded);
    } else if(currentSortIndex === 2) {
        tasks.sort((a, b) => b.status - a.status);
    } else {
        tasks.sort((a, b) => a.status - b.status);
    }
    renderTasks() 
}

// Drag and Drop обработчики
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.dataset.index); // Передаем индекс
    setTimeout(() => this.classList.add("dragging"), 0); // Добавляем класс для стилизации
}

function handleDragOver(e) {
    e.preventDefault(); // Разрешаем drop
    e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const toIndex = parseInt(this.dataset.index);

    if (fromIndex !== toIndex) {
        // Перемещаем задачу в массиве
        const [movedTask] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, movedTask);
        saveTasks();
        renderTasks(); // Перерисовываем список
    }
}

function handleDragEnd() {
    this.classList.remove("dragging");
    draggedItem = null;
}

// Работа с инпутом
const handlerInput = () =>{
const inputValue = taskInput.value.trim();

    if (inputValue == ""){
        taskInput.classList.add("input-error");       
        setTimeout(() => {
            taskInput.classList.remove("input-error");
        }, 1000);
    } else {
        tasks.push({
            text: inputValue,
            status: false,
            timeAdded: Date.now(),
        })
        console.log(tasks)
        renderTasks()
        taskInput.value = "";
    }
}

// Удаляем задачу
const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks(); 
    // Проверка: часто не удаляет последний элемент
    if (tasks.length <= 1){
        console.log("Ререндерим весь элемент")
        renderTasks();
    } else {
        console.log("Простое удаление")
        taskList.children[index].remove();
        taskCompleted.textContent = tasks.length ? `${tasks.filter(task => task.status === true).length} from ${tasks.length}` : '0';
        emptyTasks.classList.toggle("empty-tasks", tasks.length === 0);
        emptyTasks.classList.toggle("empty-tasks__none", tasks.length != 0);
    }
};


// Обновление статуса и перересовка
const toggleTaskStatus = (index) => {
    tasks[index].status = !tasks[index].status;
    renderTasks();
};


loadTasks();


taskInput.addEventListener('keydown', (e) => {
    if (e.code == 'Enter') {handlerInput()}
});
taskInputButton.addEventListener('click', handlerInput)
sortButton.addEventListener("click", toggleSort);

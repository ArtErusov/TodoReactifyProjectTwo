export const editingTask = (taskText, index, tasks) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = tasks[index].text;
    input.classList.add("editing-input");

    input.addEventListener("blur", () => saveEditedTask(input, taskText, index, tasks));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveEditedTask(input, taskText, index, tasks);
        }
    });

    taskText.replaceWith(input);
    input.focus();
};

export const saveEditedTask = (input, taskText, index, tasks) => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
    input.replaceWith(taskText); 
    taskText.textContent = tasks[index].text; 
};


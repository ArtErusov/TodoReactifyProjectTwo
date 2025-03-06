const taskInput = document.querySelector(".form-container input");
const taskInputButton = document.querySelector(".form-container button");


const tasks = [];

const handlerInput = () =>{
const inputValue = taskInput.value.trim();
    if (inputValue == ""){
        taskInput.classList.add("input-error");       
        setTimeout(() => {
            taskInput.classList.remove("input-error");
        }, 1000);
        console.log("Пустая строка")
    } else {
        console.log(inputValue);
        taskInput.value = "";
    }
}






taskInputButton.addEventListener('click', handlerInput)

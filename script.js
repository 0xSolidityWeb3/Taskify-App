const todoArr = [];

// Function to allow drop event
function allowDrop(ev) {
    ev.preventDefault();
}

// Function to add a new task
function addTodo() {
    const priorityValue = document.querySelector("#priority").value;
    todoArr.push({
        title: document.querySelector(".title-input").value,
        description: document.querySelector(".desc-input").value,
        priority: priorityValue,
        listId: "todo-list" // Set initial list to "todo-list"
    });
    render();
}

// Function to create todo item component
function todoComponent(todo, index) {
    const divEle = document.createElement('div');
    divEle.setAttribute("class", "todoBox");
    divEle.setAttribute("draggable", "true");
    divEle.setAttribute("data-index", index);
    divEle.addEventListener("dragstart", drag);

    // Create title and description
    const h2Ele = document.createElement('h2');
    const paraEle = document.createElement('p');
    h2Ele.innerHTML = todo.title;
    paraEle.innerHTML = todo.description;

    // Create priority and date section
    const priorityDateEle = document.createElement('div');
    priorityDateEle.setAttribute("class", "priority-date");

    const spanPriority = document.createElement('span');
    spanPriority.setAttribute("class", "priority");
    spanPriority.innerHTML = todo.priority;

    if (todo.priority === "High") {
        spanPriority.style.backgroundColor = "red";
    } else if (todo.priority === "Medium") {
        spanPriority.style.backgroundColor = "yellow";
    } else {
        spanPriority.style.backgroundColor = "green";
    }

    // Get and display the date with clock icon
    const spanDate = document.createElement('span');
    spanDate.setAttribute("class", "date");
    const date = new Date();
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const monthName = months[monthIndex];

    spanDate.innerHTML = `<i class="fa fa-clock-o time-icon"></i> ${day} ${monthName}, ${year}`;

    // Append priority and date to the container
    priorityDateEle.appendChild(spanPriority);
    priorityDateEle.appendChild(spanDate);

    // Create delete button (trash icon)
    const trashIcon = document.createElement('i');
    trashIcon.setAttribute("class", "fa fa-trash trash-icon");
    trashIcon.addEventListener('click', () => deleteTodo(index));

    // Append elements to todoBox
    divEle.appendChild(h2Ele);
    divEle.appendChild(paraEle);
    divEle.appendChild(priorityDateEle);
    divEle.appendChild(trashIcon);

    return divEle;
}

// Function to delete a todo
function deleteTodo(index) {
    todoArr.splice(index, 1);  // Remove the selected item
    render();  // Re-render the list
}

// Function to render the todo list
function render() {
    const taskLists = document.querySelectorAll(".task-list");
    taskLists.forEach(taskList => taskList.innerHTML = ""); // Clear all task lists

    todoArr.forEach((todo, index) => {
        const element = todoComponent(todo, index);
        const targetList = document.getElementById(todo.listId) || document.querySelector(".task-list");
        targetList.appendChild(element);
    });
}

// Function to handle drag start
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.getAttribute("data-index"));
    console.log("Drag started", event.target.getAttribute("data-index"));
}

// Function to handle drop event
function drop(ev) {
    ev.preventDefault();
    
    const index = ev.dataTransfer.getData("text/plain");
    
    if (index === "") {
        return;
    }

    const todoItem = todoArr[parseInt(index)];
    if (!todoItem) {
        return;
    }

    // Find the target task list
    let targetTaskList = ev.target.closest(".task-list");
    if (!targetTaskList) {
        targetTaskList = ev.target.querySelector(".task-list") || ev.target.closest(".box").querySelector(".task-list");
    }

    if (targetTaskList) {
        console.log("Target task list found:", targetTaskList);
        todoItem.listId = targetTaskList.id; // Update the listId of the todo item
        // Move the todo item in the DOM
        const todoElement = document.querySelector(`[data-index="${index}"]`);
        if (todoElement) {
            targetTaskList.appendChild(todoElement);
        }
    }

    // Don't call render() here, as we're manually moving the DOM element
}

// Collapsible functionality for sections
function toggleCollapse(section) {
    const taskList = section.nextElementSibling;
    const todos = taskList.querySelectorAll('.todoBox');
    
    if (taskList.style.display === "none") {
        // Expand: Show the tasks
        taskList.style.display = "block";
        section.querySelector('.collapsible-icon').innerHTML = "&#x25BC;"; // Down arrow
    } else {
        // Collapse: Hide the tasks and show count
        taskList.style.display = "none";
        section.querySelector('.collapsible-icon').innerHTML = `&#x25B6; (${todos.length})`; // Right arrow with task count
    }
}

// Add collapsible functionality to each title
document.querySelectorAll(".title").forEach((title) => {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'collapsible-icon');
    icon.innerHTML = "&#x25BC;"; // Initially down arrow
    title.appendChild(icon);
    

    // Add event listener to make section collapsible
    title.addEventListener('click', () => toggleCollapse(title));
});




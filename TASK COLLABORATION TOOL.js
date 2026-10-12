```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Management System</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f2f4f8;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
        }

        h1 {
            text-align: center;
            color: #263b80;
        }

        input, textarea, select, button {
            width: 100%;
            padding: 10px;
            margin: 7px 0;
            box-sizing: border-box;
        }

        button {
            background: #263b80;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        button:hover {
            background: #172657;
        }

        .task {
            background: #f4f6fb;
            padding: 15px;
            margin-top: 15px;
            border-left: 5px solid #263b80;
            border-radius: 5px;
        }

        .task button {
            width: auto;
            padding: 8px 12px;
            margin-right: 5px;
        }

        .delete {
            background: #d62828;
        }

        .edit {
            background: #e69500;
        }

        .task p {
            overflow-wrap: anywhere;
        }

        .status {
            color: #263b80;
            font-weight: bold;
        }
    </style>
</head>

<body>

<div class="container">
    <h1>Task Management System</h1>

    <h2>Add / Edit Task</h2>

    <form id="taskForm">
        <input type="hidden" id="taskId">

        <input type="text" id="title"
               placeholder="Task Title" required>

        <textarea id="description"
                  placeholder="Task Description" required></textarea>

        <input type="text" id="assignee"
               placeholder="Assigned Person" required>

        <select id="priority" required>
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>

        <input type="date" id="dueDate" required>

        <select id="status" required>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
        </select>

        <button type="submit" id="saveButton">Add Task</button>
    </form>

    <h2>All Tasks</h2>

    <input type="text" id="search"
           placeholder="Search tasks by title or assignee">

    <div id="taskList"></div>
</div>

<script>
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const form = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function displayTasks() {
        taskList.innerHTML = "";

        const searchText =
            document.getElementById("search").value.toLowerCase();

        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchText) ||
            task.assignee.toLowerCase().includes(searchText)
        );

        if (filteredTasks.length === 0) {
            taskList.innerHTML = "<p>No tasks found.</p>";
            return;
        }

        filteredTasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";

            const heading = document.createElement("h3");
            heading.textContent = task.title;

            const description = document.createElement("p");
            description.textContent = "Description: " + task.description;

            const assignee = document.createElement("p");
            assignee.textContent = "Assigned to: " + task.assignee;

            const priority = document.createElement("p");
            priority.textContent = "Priority: " + task.priority;

            const dueDate = document.createElement("p");
            dueDate.textContent = "Due Date: " + task.dueDate;

            const statusLabel = document.createElement("label");
            statusLabel.textContent = "Status: ";

            const statusSelect = document.createElement("select");

            ["To Do", "In Progress", "Completed"].forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });

            statusSelect.value = task.status;

            statusSelect.addEventListener("change", function() {
                const index = tasks.findIndex(t => t.id === task.id);

                if (index !== -1) {
                    tasks[index].status = statusSelect.value;
                    saveTasks();
                    displayTasks();
                }
            });

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit";
            editButton.addEventListener("click", () => editTask(task.id));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";
            deleteButton.addEventListener("click", () => deleteTask(task.id));

            div.append(
                heading, description, assignee, priority, dueDate,
                statusLabel, statusSelect, editButton, deleteButton
            );

            taskList.appendChild(div);
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description =
            document.getElementById("description").value.trim();
        const assignee = document.getElementById("assignee").value.trim();
        const priority = document.getElementById("priority").value;
        const dueDate = document.getElementById("dueDate").value;
        const status = document.getElementById("status").value;
        const taskId = document.getElementById("taskId").value;

        if (!title || !description || !assignee ||
            !priority || !dueDate) {
            alert("Please fill in all required fields.");
            return;
        }

        if (dueDate < new Date().toLocaleDateString("en-CA")) {
            alert("Please select today or a future due date.");
            return;
        }

        if (taskId) {
            const index = tasks.findIndex(task =>
                task.id === Number(taskId)
            );

            if (index !== -1) {
                tasks[index] = {
                    id: Number(taskId),
                    title,
                    description,
                    assignee,
                    priority,
                    dueDate,
                    status
                };
            }
        } else {
            tasks.push({
                id: Date.now(),
                title,
                description,
                assignee,
                priority,
                dueDate,
                status
            });
        }

        saveTasks();
        form.reset();
        document.getElementById("taskId").value = "";
        document.getElementById("saveButton").textContent = "Add Task";

        displayTasks();
    });

    function editTask(id) {
        const task = tasks.find(task => task.id === id);

        if (!task) return;

        document.getElementById("taskId").value = task.id;
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description;
        document.getElementById("assignee").value = task.assignee;
        document.getElementById("priority").value = task.priority;
        document.getElementById("dueDate").value = task.dueDate;
        document.getElementById("status").value = task.status;

        document.getElementById("saveButton").textContent = "Update Task";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function deleteTask(id) {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            displayTasks();
        }
    }

    document.getElementById("search")
        .addEventListener("input", displayTasks);

    displayTasks();
</script>

</body>
</html>
```

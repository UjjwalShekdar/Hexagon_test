const taskInput = document.getElementById('taskInput');
const statusSelect = document.getElementById('statusSelect');
const taskList = document.getElementById('taskList');

const apiUrl = 'http://localhost:3000/tasks';

async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();

  taskList.innerHTML = '';

  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${task.text}</span>
      <span class="status">${task.completed ? 'Complete' : 'Incomplete'}</span>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(listItem);
  });
}

// ...

async function addTask() {
  const taskText = taskInput.value.trim();
  const taskStatus = statusSelect.value;

  if (!taskText) {
    alert('Please enter a task.');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: taskText, completed: taskStatus === 'complete' }),
  });

  if (response.ok) {
    taskInput.value = '';
    fetchTasks();
  } else {
    alert('Error adding task. Please try again.');
  }
}


async function deleteTask(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    fetchTasks();
  }
}

fetchTasks();

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${task.text}</span>
      <span class="status">${task.completed ? 'Complete' : 'Incomplete'}</span>
      <button class="edit-button" onclick="editTask(${task.id})">Edit</button>
      <button class="delete-button" onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(listItem);
  });
}

// ...

// Initialize tasks
fetchTasks();

// ...

// Update task status
async function updateTaskStatus(id, status) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed: status === 'complete' }),
  });

  if (response.ok) {
    fetchTasks();
  } else {
    alert('Error updating task status. Please try again.');
  }
}

// Delete task
async function deleteTask(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    fetchTasks();
  } else {
    alert('Error deleting task. Please try again.');
  }
}



// Initialize tasks
fetchTasks();

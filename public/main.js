const taskInput = document.getElementById('taskInput');
const statusSelect = document.getElementById('statusSelect');
const taskList = document.getElementById('taskList');

const apiUrl = 'http://localhost:3000/api/tasks';

async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (Array.isArray(data)) {
      // If the data is an array, assume it's the list of tasks
      renderTasks(data);
    } else if (data && Array.isArray(data.tasks)) {
      // If the data is an object with a 'tasks' property, use that
      renderTasks(data.tasks);
    } else {
      console.error('Invalid data structure:', data);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function updateTaskStatus(id, status) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskStatus: status }),
    });

    if (response.ok) {
      fetchTasks();
    } else {
      alert('Error updating task status. Please try again.');
    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted task from the UI
      const taskElement = document.getElementById(`task-${id}`);
      if (taskElement) {
        taskElement.remove();
      }
    } else {
      alert('Error deleting task. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}



async function addTask() {
  const taskText = taskInput.value.trim();
  const taskStatus = statusSelect.value;

  if (!taskText) {
    alert('Please enter a task.');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName: taskText,
        taskStatus: taskStatus === 'complete' ? 'Complete' : 'Incomplete',
      }),
    });

    if (response.ok) {
      taskInput.value = '';
      fetchTasks(); // Fetch and display updated tasks
    } else {
      alert('Error adding task. Please try again.');
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
}



function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const listItem = document.createElement('tr');
    listItem.setAttribute('id', `task-${task.id}`);
    listItem.innerHTML = `
      <td>${task.taskName}</td>
      <td class="status">${task.taskStatus}</td>
      <td>
        <div class="action-dropdown">
          <select onchange="handleActionChange(${task.id}, this.value)">
            <option value="none">Actions</option>
            <option value="complete">Mark Complete</option>
            <option value="incomplete">Mark Incomplete</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </td>
    `;
    taskList.appendChild(listItem);
  });
}

async function handleActionChange(id, action) {
  if (action === 'complete') {
    await updateTaskStatus(id, 'Complete');
  } else if (action === 'incomplete') {
    await updateTaskStatus(id, 'Incomplete');
  } else if (action === 'delete') {
    await deleteTask(id);
  }
}




// Initialize tasks
fetchTasks();

// DOM elements
const modeBtn = document.getElementById('toggleMode');
const searchInput = document.getElementById('searchInput');
const addTaskBtn = document.getElementById('addTaskBtn');

const taskTitleInput = document.getElementById('taskTitle');
const taskDescInput = document.getElementById('taskDesc');
const taskPrioritySelect = document.getElementById('taskPriority');
const taskDueInput = document.getElementById('taskDue');
const taskCategorySelect = document.getElementById('taskCategory');

const pendingTasksList = document.getElementById('pendingTasks');
const completedTasksList = document.getElementById('completedTasks');

let tasks = [];
let editIndex = null;

// Toggle dark/light mode
modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌗';
});

// Add or update task
addTaskBtn.addEventListener('click', () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueInput.value;
  const category = taskCategorySelect.value;

  if (!title) {
    alert('Please enter a task title!');
    return;
  }

  if (!priority) {
    alert('Please select a priority!');
    return;
  }

  if (!category) {
    alert('Please select a category!');
    return;
  }

  if (editIndex !== null) {
    // Update existing task
    tasks[editIndex] = { ...tasks[editIndex], title, description, priority, dueDate, category };
    editIndex = null;
    addTaskBtn.textContent = '➕ Add Task';
  } else {
    // Add new task
    tasks.push({
      id: Date.now(),
      title,
      description,
      priority,
      dueDate,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
  }

  resetInputs();
  renderTasks();
});

// Reset input fields
function resetInputs() {
  taskTitleInput.value = '';
  taskDescInput.value = '';
  taskPrioritySelect.value = '';
  taskDueInput.value = '';
  taskCategorySelect.value = '';
}

// Render tasks filtered by search
function renderTasks() {
  const query = searchInput.value.toLowerCase();

  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    if (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    ) {
      const taskItem = createTaskElement(task, index);
      if (task.completed) {
        completedTasksList.appendChild(taskItem);
      } else {
        pendingTasksList.appendChild(taskItem);
      }
    }
  });
}

// Create task DOM element
function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.dataset.priority = task.priority;

  const title = document.createElement('strong');
  title.textContent = task.title;

  // Add priority emoji to title
  // (handled by CSS via data attribute)

  const desc = document.createElement('span');
  desc.textContent = task.description;

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  meta.textContent = `📅 Due: ${task.dueDate || 'No due date'} • 📁 ${task.category}`;

  const created = document.createElement('div');
  created.className = 'task-meta';
  created.textContent = `🕒 Created: ${new Date(task.createdAt).toLocaleString()}`;

  li.appendChild(title);
  if (task.description) li.appendChild(desc);
  li.appendChild(meta);
  li.appendChild(created);

  if (task.completed) {
    const completedAt = document.createElement('div');
    completedAt.className = 'task-meta';
    completedAt.textContent = `✅ Completed: ${task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}`;
    li.appendChild(completedAt);
  }

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // Complete / Undo button
  const toggleBtn = document.createElement('button');
  toggleBtn.title = task.completed ? 'Mark as Pending' : 'Mark as Complete';
  toggleBtn.innerHTML = task.completed ? '<i class="fa-solid fa-rotate-left"></i>' : '<i class="fa-solid fa-check"></i>';
  toggleBtn.addEventListener('click', () => {
    toggleTaskCompletion(index);
  });
  actions.appendChild(toggleBtn);

  // Edit button (only if pending)
  if (!task.completed) {
    const editBtn = document.createElement('button');
    editBtn.title = 'Edit Task';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.addEventListener('click', () => {
      startEditTask(index);
    });
    actions.appendChild(editBtn);
  }

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.title = 'Delete Task';
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener('click', () => {
    deleteTask(index);
  });
  actions.appendChild(deleteBtn);

  li.appendChild(actions);

  return li;
}

function toggleTaskCompletion(index) {
  const task = tasks[index];
  task.completed = !task.completed;
  if (task.completed) {
    task.completedAt = new Date().toISOString();
  } else {
    task.completedAt = null;
  }
  renderTasks();
}

function startEditTask(index) {
  const task = tasks[index];
  taskTitleInput.value = task.title;
  taskDescInput.value = task.description;
  taskPrioritySelect.value = task.priority;
  taskDueInput.value = task.dueDate;
  taskCategorySelect.value = task.category;

  editIndex = index;
  addTaskBtn.textContent = '💾 Save Task';
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    if (editIndex === index) {
      resetInputs();
      editIndex = null;
      addTaskBtn.textContent = '➕ Add Task';
    }
    renderTasks();
  }
}

// Search filtering live
searchInput.addEventListener('input', renderTasks);

// Initial render
renderTasks();

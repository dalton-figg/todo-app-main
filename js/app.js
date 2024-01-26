// --- Helper Functions

const createElement = (element, classes) => {
  let elem = document.createElement(element);
  if (classes) elem.classList.add(...classes);

  return elem;
};

// --- Variable Declerations

const taskList = document.querySelector('.tasks'); // Stores a reference to the unordered list parent

const taskCounter = document.querySelector('.task-counter'); // Stores a reference to the paragraph which declares 'x items left'

const clearCompleted = document.getElementById('clearCompleted');
const createTask = document.getElementById('createTask');
const createInput = document.getElementById('create');

const activeButton = document.getElementById('activeButton');
const allButton = document.getElementById('allButton');

let tasks = [
  { id: 1, task: 'Read for 1 hour', completed: false },
  { id: 2, task: 'Complete a JavaScript course', completed: false },
  { id: 3, task: 'Go for a run', completed: false },
];

// --- Main Functions

// TODO: completed tab
// TODO: clear completed

// TODO: helper for taskList.children[i].className === 'task'  and for getting the divider

// TODO: fix task count bugs - not sure where it's occuring

const updateTaskCount = () => {
  let completedTaskCount = 0;

  for (let i = 0; i < taskList.children.length; i++) {
    if (
      taskList.children[i].className === 'task' &&
      taskList.children[i].children[0].checked
    ) {
      completedTaskCount++;
    }
  }

  // Calculate the amount of uncompleted tasks using the amount of tasks - completed
  let tasksRemaining = tasks.length - completedTaskCount;

  // Update the innerHTML
  taskCounter.innerHTML = `${tasksRemaining} items left`;
};

const generateTaskDeleteImage = () => {
  let taskDelete = createElement('img', ['delete-task']);
  taskDelete.src = '/images/icon-cross.svg';
  taskDelete.width = '15';
  taskDelete.height = '15';
  taskDelete.alt = 'X icon to delete task';

  return taskDelete;
};

const generateTask = (task) => {
  // Generate the <li class="task">
  let taskListItem = createElement('li', ['task']);
  taskListItem.draggable = true;

  // Generate the <input type="checkbox" id="1" class="checkbox"/> with incremeneting id
  let taskCheckbox = createElement('input', ['checkbox']);
  taskCheckbox.type = 'checkbox';
  // Ensures that the state of the task persists after a new task is added
  task.completed
    ? (taskCheckbox.checked = true)
    : (taskCheckbox.checked = false);
  taskCheckbox.id = task.id;

  // Generate the <label for="1"></label> with a matching id and the correct task
  let taskLabel = createElement('label');
  taskLabel.htmlFor = task.id;
  taskLabel.innerHTML = task.task;

  // Generates the <img src="/images/icon-cross.svg" width="15" height="15" alt="Cross icon - remove task" class="delete-task">

  let taskDelete = generateTaskDeleteImage();

  taskListItem.appendChild(taskCheckbox);
  taskListItem.appendChild(taskLabel);
  taskListItem.appendChild(taskDelete);

  return taskListItem;
};

// Loop over the predetermined tasks when the page loads

const populateTasks = () => {
  tasks.forEach((task) => {
    // Appened the generated elements to the task list
    taskList.appendChild(generateTask(task));
    // After every task, append a task divider
    taskList.appendChild(createElement('hr', ['task-divider']));
  });

  // After every population, we need to update the item count
  updateTaskCount();

  // If a new task has been added but some are completed, do not make them appear again

  if (activeButton.className === 'task-button task-button--active')
    hideActiveTasks();
};

const updateCompletedValue = (e) => {
  // Access the label of the card to match against the list
  let taskChecked;

  let taskLabel = e.target.nextSibling.innerHTML;

  // Loop until we find a matching task, which means we have our index - this way we don't rely on the id of each task to match which breaks if tasks are deleted

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].task === taskLabel) taskChecked = tasks[i];
  }

  // Update it's completed value depending on it's current state
  taskChecked.completed
    ? (taskChecked.completed = false)
    : (taskChecked.completed = true);

  // Update the task count
  updateTaskCount();

  // If a task gets checked as complete while in this filter, automatically hide it

  if (activeButton.className === 'task-button task-button--active')
    hideActiveTasks();
};

const deleteTask = (e) => {
  // The deletion icon is a child of the task, so access the targetted task and the id
  let taskToDelete = e.target.parentNode;
  // The id is accessed via getting the previous sibling which is the label and accessing it's for attribute (which will match to the actual checkbox input id)
  let taskToDeleteId = e.target.previousSibling.htmlFor;
  // Ensure we can get the divider to remove from the page
  let taskDividerToDelete = taskToDelete.nextSibling;

  // Remove the task and it's divider from the page
  taskToDelete.remove();
  taskDividerToDelete.remove();

  // Remove the task from the array of objects
  tasks.splice(taskToDeleteId - 1, 1);

  // Update the count
  updateTaskCount();
};

const changeActiveButton = (e) => {
  e.preventDefault();
  let filterButtons = document.querySelectorAll('.task-button');

  // Remove the active styling class from all the buttons
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].classList.remove('task-button--active');
  }

  // Add it back to the clicked button
  e.target.classList.add('task-button--active');
};

const hideActiveTasks = () => {
  // Loop over the tasks
  for (let i = 0; i < taskList.children.length; i++) {
    // Checking for tasks and if the tasks checkbox is checked
    if (
      taskList.children[i].className === 'task' &&
      taskList.children[i].children[0].checked
    ) {
      let taskDivider = taskList.children[i + 1];

      // Hide the task and it's divider

      taskList.children[i].style.display = 'none';
      taskDivider.style.display = 'none';
    }
  }
};

// --- Event Listeners

// Task count needs to be updated everytime a task is checked, along with it's value of checked

taskList.addEventListener('click', (e) => {
  // Use event bubbling to check for if a delete icon is being clicked
  if (e.target.className === 'delete-task') deleteTask(e);

  // Use event bubbling to listen for any clicks that are made on a task's checkbox
  if (e.target.className === 'checkbox') updateCompletedValue(e);
});

// Listen to see if the user is trying to create a new task

createTask.addEventListener('click', (e) => {
  // Prevent from a form submission (refreshing the page)
  e.preventDefault();
  let taskName = createInput.value;
  // Clears the value after a task is added
  createInput.value = '';

  // Only create a new task instance if the task isn't blank

  if (taskName) {
    // Get the next free id
    let newId = tasks[tasks.length - 1].id + 1;
    // Add the new task to the array
    tasks.push({ id: newId, task: taskName, completed: false });
    // Clear the list before repopulating
    taskList.innerHTML = '';
    populateTasks();
  }
});

// Listen for a click on the 'active' button filter

activeButton.addEventListener('click', (e) => {
  changeActiveButton(e);
  hideActiveTasks();
});

// Listen for a click on the 'all' button filter

allButton.addEventListener('click', (e) => {
  changeActiveButton(e);

  // Loop over the tasks
  for (let i = 0; i < taskList.children.length; i++) {
    let taskDivider = taskList.children[i + 1];

    // Show the task and it's divider

    if (taskList.children[i].style.display && taskDivider.style.display) {
      taskList.children[i].style.display = '';
      taskDivider.style.display = '';
    }
  }
});

populateTasks();
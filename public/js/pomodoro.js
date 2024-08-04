//Get DOM elements
const pomodoroTimer = document.getElementById('timeText');
const startButton = document.getElementById('startTimer');
const pauseButton = document.getElementById('pauseTimer');
const saveButton = document.getElementById('saveTimer');
const skipButton = document.getElementById('skipBreak');
const addTaskForm = document.getElementById('addTaskForm');
const currentTaskText = document.getElementById('taskText');
const user_id = document.getElementById('user_id').innerHTML;
let selectedTaskId = undefined;

pauseButton.style.display = 'none';
saveButton.style.display = 'none';
skipButton.style.display = 'none';

let pomodoroTime = 25 * 60 * 1000;
let breakTime = 5 * 60 * 1000;
let pomodoroStartDate;
let pomodoroDuration;
let initialTime = 25 * 60 * 1000;
let timer;
let timeLeft = initialTime;
let minutes;
let seconds;
let currentMode = 'pomodoro';
let formerMode;

startButton.addEventListener('click', () => {
  if (currentMode === 'pomodoro') {
    startPomodoro();
  } else if (currentMode === 'break') {
    startBreak();
  } else if (currentMode === 'paused') {
    timer = setInterval(onTick, 1000);
    currentMode = formerMode;
  }

  startButton.disabled = true;
  pauseButton.style.display = 'block';
});

pauseButton.addEventListener('click', () => {
  formerMode = currentMode;
  currentMode = 'paused';
  clearInterval(timer);
  startButton.disabled = false;
  pauseButton.style.display = 'none';
});

skipButton.addEventListener('click', () => {
  stopBreak();
});

saveButton.addEventListener('click', () => {
  stopPomodoro();
});
function startPomodoro() {
  initialTime = pomodoroTime;
  timeLeft = initialTime;
  timer = setInterval(onTick, 1000);
  saveButton.style.display = 'block';
  pomodoroStartDate = Date.now();
  pomodoroDuration = 0;
}

function stopPomodoro() {
  pomodoroTimer.textContent = 'Pomodoro Done! Break Time!';
  startButton.disabled = false;
  pauseButton.style.display = 'none';
  saveButton.style.display = 'none';
  currentMode = 'break';
  initialTime = breakTime;
  timeLeft = initialTime;
  clearInterval(timer);
  savePomodoro(
    user_id,
    selectedTaskId,
    pomodoroStartDate,
    Date.now(),
    pomodoroDuration
  );
  document.title = 'NodeFocus';
}
function startBreak() {
  skipButton.style.display = 'block';
  initialTime = breakTime;
  timeLeft = initialTime;
  timer = setInterval(onTick, 1000);
}

function stopBreak() {
  pomodoroTimer.textContent = 'Break Done! Pomodoro Time!';
  startButton.disabled = false;
  pauseButton.style.display = 'none';
  skipButton.style.display = 'none';
  currentMode = 'pomodoro';
  initialTime = pomodoroTime;
  timeLeft = initialTime;
  clearInterval(timer);
  document.title = 'NodeFocus';
}

async function savePomodoro(user_id, task_id, start_time, end_time, duration) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/pomodoros',
      data: {
        user: user_id,
        task: task_id,
        start_time,
        end_time,
        duration,
      },
    });
    if (res.data.status === 'success') {
      console.log('Pomodoro saved to database!');
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
}

function onTick() {
  timeLeft -= 1000;

  minutes = timeLeft / 60 / 1000;
  seconds = (timeLeft / 1000) % 60;
  if (seconds >= 10) {
    pomodoroTimer.textContent = `${Math.trunc(minutes)}:${seconds}`;
    document.title = `${Math.trunc(minutes)}:${seconds} | NodeFocus`;
  } else {
    pomodoroTimer.textContent = `${Math.trunc(minutes)}:0${seconds}`;
    document.title = `${Math.trunc(minutes)}:0${seconds} | NodeFocus`;
  }

  if (timeLeft <= 0) {
    if (currentMode === 'pomodoro') {
      stopPomodoro();
    } else if (currentMode === 'break') {
      stopBreak();
    }
  }
  if (currentMode === 'pomodoro') {
    pomodoroDuration += 1000;
  }
}

// TASKS

addTaskForm.addEventListener('submit', async () => {
  const taskName = document.getElementById('addTask').value.trim();
  if (taskName.length > 12) {
    alert('Maximum taskname length is 12 chars');
  } else {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8080/api/v1/tasks/',
        data: {
          name: taskName,
          user: user_id,
        },
      });
      if (res.data.status === 'success') {
        console.log('Task send successfully!');
        const listGroup = document.getElementsByClassName('list-group');

        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskIdItem = document.createElement('div');
        taskIdItem.id = 'task_id';
        taskIdItem.classList.add('task_id');
        taskIdItem.classList.add('invisible');
        taskIdItem.innerHTML = res.data.data.task._id;

        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('d-flex');
        li.classList.add('justify-content-between');
        li.classList.add('align-items-center');

        const taskHeader = document.createElement('h4');
        taskHeader.classList.add('taskHeader');

        taskHeader.textContent = taskName;

        const taskButtonGroup = document.createElement('div');
        taskButtonGroup.classList.add('task-button-group');

        const selectTaskButton = document.createElement('button');
        selectTaskButton.id = 'selectTaskButton';
        selectTaskButton.classList.add('btn');
        selectTaskButton.classList.add('btn-primary');
        selectTaskButton.classList.add('selectTaskButton');
        selectTaskButton.textContent = 'Select';
        const lists = document.querySelectorAll('.list-group-item');
        selectTaskButton.onclick = () => selectTask(res.data.data.task._id);

        const deleteTaskButton = document.createElement('button');
        deleteTaskButton.id = 'deleteTaskButton';
        deleteTaskButton.classList.add('btn');
        deleteTaskButton.classList.add('btn-danger');
        deleteTaskButton.classList.add('deleteTaskButton');
        deleteTaskButton.textContent = 'Delete';
        deleteTaskButton.onclick = () => deleteTask(res.data.data.task._id);

        li.appendChild(taskHeader);

        taskButtonGroup.appendChild(selectTaskButton);
        taskButtonGroup.appendChild(deleteTaskButton);
        li.appendChild(taskButtonGroup);

        taskItem.appendChild(taskIdItem);
        taskItem.appendChild(li);
        listGroup[0].appendChild(taskItem);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  }
});

//For the tasks already on page

document.addEventListener('DOMContentLoaded', () => {
  const lists = document.querySelectorAll('.task-item');
  lists.forEach((item, index) => {
    const task_id = item.getElementsByClassName('task_id')[0].innerHTML;
    item.getElementsByClassName('selectTaskButton')[0].onclick = () =>
      selectTask(task_id);
    item.getElementsByClassName('deleteTaskButton')[0].onclick = () =>
      deleteTask(task_id);
  });
});

async function selectTask(task_id) {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8080/api/v1/tasks/${task_id}`,
    });
    if (res.data.status === 'success') {
      currentTaskText.textContent = `Current task: ${res.data.data.task.name}`;
      selectedTaskId = task_id;
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
}

async function deleteTask(task_id) {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8080/api/v1/tasks/${task_id}`,
    });
    if (res.data.status === 'success') {
      console.log('Task Deleted!');
      if (selectedTaskId === task_id) {
        currentTaskText.textContent = `Current task: none`;
        selectedTaskId = undefined;
      }
      const lists = document.querySelectorAll('.task-item');
      lists.forEach((item) => {
        if (item.getElementsByClassName('task_id')[0].innerHTML === task_id) {
          item.remove();
        }
      });
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
}

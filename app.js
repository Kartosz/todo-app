/* elements and global variables */
const addTodoBtn = document.getElementById('add-todo-btn');
const todosNav = document.getElementById('sidebar');
let todoListArray = [];
let todosFilter = 'all';
let filteredTodos = [];

/* localStorage functions */
const saveTodos = () => {
  const todoListJson = JSON.stringify(todoListArray);
  localStorage.setItem('todoList', todoListJson);
};

const getTodos = () => JSON.parse(localStorage.getItem('todoList')) || [];

/* add a new todo */
addTodoBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const todoText = document.getElementById('todo-text').value;
  const todoDate = document.getElementById('todo-date').value;

  if (todoText.trim() !== '' && todoDate.trim() !== '') {
    const todoItem = {
      text: todoText,
      date: todoDate,
      completed: false,
    };

    todoListArray.push(todoItem);

    saveTodos();
    renderTodos();
    document.getElementById('todo-text').value = '';
    document.getElementById('todo-date').value = '';
  }
});

/* filter todos */
todosNav.addEventListener('click', (event) => {
  const filter = event.target.getAttribute('data-filter');

  if (filter) {
    todosFilter = filter;
    renderTodos();
  }
});

/* render todos */
const renderTodos = () => {
  const todosList = document.getElementById('todos-list');
  todosList.innerHTML = '';

  filteredTodos = todoListArray;

  if (todosFilter !== 'all') {
    filteredTodos = filteredTodos.filter(
      (todo) =>
        (todosFilter === 'today' && isToday(new Date(todo.date))) ||
        (todosFilter === 'overdue' && isOverdue(new Date(todo.date))) ||
        (todosFilter === 'scheduled' && !isToday(new Date(todo.date)) && !isOverdue(new Date(todo.date))) ||
        (todosFilter === 'pending' && !todo.completed) ||
        (todosFilter === 'completed' && todo.completed)
    );
  }

  filteredTodos.forEach((todo, index) => {
    const todoItem = document.createElement('li');
    const todoText = document.createElement('span');
    const todoDate = document.createElement('span');
    const todoDeleteBtn = document.createElement('button');
    const todoCheckbox = document.createElement('button');

    todoItem.classList.add('todo-item');
    todoText.classList.add('todo-text');
    todoDate.classList.add('todo-date');
    todoDeleteBtn.classList.add('delete-btn');
    todoCheckbox.classList.add('todo-btn');

    todoText.textContent = todo.text;
    todoDate.textContent = formatDate(todo.date);
    todoDeleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    todoDeleteBtn.addEventListener('click', () => {
      todoListArray.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    todoCheckbox.type = 'button';
    if (todo.completed) {
      const completedIcon = document.createElement('i');
      completedIcon.classList.add('fa-regular', 'fa-circle-check');
      todoCheckbox.appendChild(completedIcon);
    } else {
      todoCheckbox.innerHTML = '<i class="fa-regular fa-circle"></i>';
    }
    todoCheckbox.checked = todo.completed;
    todoCheckbox.addEventListener('click', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    
      const currentIcon = todoCheckbox.querySelector('i');
      if (todo.completed) {
        currentIcon.classList.remove('fa-regular', 'fa-circle');
        currentIcon.classList.add('fa-regular', 'fa-check-circle');
      } else {
        currentIcon.classList.remove('fa-regular', 'fa-check-circle');
        currentIcon.classList.add('fa-regular', 'fa-circle');
      }
    });
    

    if (isOverdue(new Date(todo.date))) {
      todoDate.classList.add('overdue');
    }

    todoItem.appendChild(todoCheckbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDate);
    todoItem.appendChild(todoDeleteBtn);
    todosList.appendChild(todoItem);
  });
};


/* utility functions */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isOverdue = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  return date < today;
};

/* initialization */
todoListArray = getTodos();
renderTodos();

const sidebar = document.querySelector('.sidebar')
const sidebarToggleBtn = document.querySelector('.sidebar-toggle')
const app = document.querySelector('.app')

sidebarToggleBtn.onclick = (e) =>{
    e.preventDefault()
    sidebar.classList.toggle('sidebar-small')
    app.classList.toggle('app-big')
}

window.onresize = () =>{
    if(window.innerWidth < 600){
        sidebar.classList.add('sidebar-small')
    }else{
        sidebar.classList.remove('sidebar-small')
    }
}

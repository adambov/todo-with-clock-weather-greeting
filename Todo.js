let input = document.querySelector('.input');
let output = document.querySelector('.countOfTotalTodos');
let todoList = document.querySelector('.todo-list');
let addBtn = document.querySelector('.submit');
let time = document.querySelector('.time');
let temperature = document.querySelector('.temperature');
let weatherDescr = document.querySelector('.weatherDescr');
let greet = document.querySelector('.greet');
let nameField = document.querySelector('.name');

let count = 0;

let url = 'http://localhost:3000/todos';

window.addEventListener('load', () => {

const weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/sofia?unitGroup=metric&include=current&key=8KMD372YW2Q8GMA8MVMBV36BS&contentType=json`;

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        // console.log(long, long)

    fetch(weatherApi)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data);
            const{temp, conditions} = data.currentConditions;
            // console.log({temp, conditions});
            //Set dom Elements from API
            temperature.textContent = `${temp} C`;
            weatherDescr.textContent = conditions;
        });
})
}
});

addBtn.addEventListener('click', addTodo);

addBtn.onclick = function () {
    count++;
    output.innerHTML = `Total Todos: ${count}`;
}

todoList.addEventListener('click', deleteCheck);

function deleteCheck(e) {
    let item = e.target.parentElement;
    let singleTodo = item.parentElement;
    let todoId = singleTodo.getAttribute('id');
    // let checkClickCount = 0;
    // console.log(singleTodo);
    // console.log(todoId);
    // checkClickCount++;

    if (item.classList[0] === 'checkBtn') {
        let checked = singleTodo.classList.toggle('completed');
        console.log(checked);

        if (checked === true) {
            editTodoOnServerTrue(`${url}/${todoId}`);
            localStorage.setItem('todoState', checked);
            localStorage.setItem('todoId', todoId);

        } else {

            editTodoOnServerFalse(`${url}/${todoId}`); 
            localStorage.setItem('todoState', checked);
            localStorage.setItem('todoId', todoId);

        }
        
    }

    if (item.classList[0] === 'delBtn') {
        singleTodo.remove();
        delTodoOnserver(`${url}/${todoId}`);
        count--;
        output.innerHTML = `Total Todos: ${count}`;
    }

}
window.addEventListener('load', (event) => {
    let state = localStorage.getItem('todoState');
    let id = localStorage.getItem('todoId');

    // първо трябва при релоад на страницата последното променяно тодо да се появи зачертано чрез css, 
    //след това ще мисля как да го направя за повече от едно

    // трябва да кажа първо в локал сторидж да за пазазва тру и ид за всеки един елемент
    // след това да взима за всеки един елемент според ид и статус и да ги маркира на страницата като завършени

    console.log(state);
    console.log(id);

    if (state === true) {
        
    } else {

    }

  });


function displayTime() {
    let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

    // Output Time
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

    setTimeout(displayTime, 1000);

}

function addZero(n) {
    return (parseInt(n,10) < 10 ? '0' : '') + n;
}

function greeting() {
    let today = new Date();
    // let today = new Date(2022, 06, 8, 19, 33, 30);
    let hour = today.getHours();

    if (hour < 10) {
        greet.innerHTML = 'Good Morning';
    } else if ( hour >= 10 && hour < 18) {
        greet.innerHTML = 'Good Day';
    } else {
        greet.innerHTML = 'Good Evening';
    }
}
     


// get todos from server
function getTodosOnLoad(url) {
    fetch(url)
    .then(r => r.json())
    .then(data => data.forEach(todo => {
        createTodo(todo.id, todo.title);
        count++,
        output.innerHTML = `Total Todos: ${count}`
    }
        // console.log(data),
    ));
}


function newTodoOnServer() {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title: input.value,
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then (r => r.json)
    .then (data => console.log(data));
}

function editTodoOnServerTrue(url, todoId) {
    fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
            completed: true
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then (r => r.json)
    .then (data => console.log(data));
}

function editTodoOnServerFalse(url, todoId) {
    fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then (r => r.json)
    .then (data => console.log(data));
}

function delTodoOnserver(url, todoId) {
    fetch(url, {
  method: 'DELETE',
});

}

function createTodo(id, title) {
    const singleTodo = document.createElement('li');
    singleTodo.classList.add('singleTodo');
    singleTodo.setAttribute('id', id);
    todoList.appendChild(singleTodo);
    singleTodo.innerHTML = `${id}. ${title}`;

    const delBtn = document.createElement('button');
    delBtn.classList.add('delBtn');
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    singleTodo.appendChild(delBtn);

    const checkBtn = document.createElement('button');
    checkBtn.classList.add('checkBtn');
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    singleTodo.appendChild(checkBtn);

}

function addTodo() {
    createTodo(count+1, input.value);
    newTodoOnServer();

    input.value = '';

}

getTodosOnLoad(url);
displayTime();
greeting();

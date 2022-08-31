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
// let weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}${long}?unitGroup=metric&include=current&key=8KMD372YW2Q8GMA8MVMBV36BS&contentType=json`;
let url = 'http://localhost:3000/todos';

window.addEventListener('load', () => {

const weatherApi = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/sofia?unitGroup=metric&include=current&key=8KMD372YW2Q8GMA8MVMBV36BS&contentType=json`;

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;

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
    const item = e.target.parentElement;
    const singleTodo = item.parentElement;
    const todoId = singleTodo.getAttribute('id');
    const checkClickCount = 0;
    // console.log(singleTodo);
    // console.log(todoId);


    if (item.classList[0] === 'checkBtn') {
        singleTodo.classList.toggle('completed');
        editTodoOnServerTrue(`${url}/${todoId}`);
        checkClickCount++;
        if ( checkClickCount % 2 === 0 ) {
            editTodoOnServerFalse(`${url}/${todoId}`);
        }
    }

    if (item.classList[0] === 'delBtn') {
        singleTodo.remove();
        delTodoOnserver(`${url}/${todoId}`);
        count--;
        output.innerHTML = `Total Todos: ${count}`;
    }

}

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
getWeather(weatherApi);
displayTime();
greeting();
///someting
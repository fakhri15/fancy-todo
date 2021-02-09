const baseURL = 'https://checklist-app-15.herokuapp.com' 

$(document).ready(() => { 
  
  authentication()

  $('#reg-button').click((event) => { 
    event.preventDefault() 
    const email = $('#reg-email').val() 
    const password = $('#reg-password').val() 
    $.ajax({ 
      url : `${baseURL}/user/register`,
      method :'POST',
      data : {email,password} 
    }) 
    .done(response => {   
      toLoginForm()
      console.log('Register succes')
    }) 
    .fail(err => { 
      console.log(err)
    }) 
    .always(() => { 
      $('#reg-email').val('')
      $('#reg-password').val('')
    })
  }) 

  $('#btn-to-reg-form').click((event) => { 
      event.preventDefault() 
      toRegisterForm()
  }) 

  $('#login-button').click((event) => { 
      event.preventDefault()
      const email = $('#log-email').val() 
      const password = $('#log-password').val() 
      $.ajax({ 
          url : `${baseURL}/user/login`,
          method :'POST',
          data : {email,password}
      }) 
      .done ((response) => { 
          let access_token = response.access_token 
          localStorage.setItem('access_token',access_token) 
          $('#log-email').val('')
          $('#log-password').val('')
          authentication()
      }) 
      .fail((err) => { 
          console.log(err)
      }) 
  })

  $('#log-out').click((event) => { 
    event.preventDefault() 
    logOut()
  }) 

  $('#add-todo').click((event) => { 
    event.preventDefault() 
    toAddToDoForm()
  })
  
  $('#add-todo-button').click((event) => { 
    event.preventDefault() 
    const title =  $('#add-title').val()
    const description = $('#add-description').val()
    const due_date = $('#add-due-date').val()
    const status = $('#add-status').val() 
    $.ajax({ 
      url : `${baseURL}/todos`,
      method :'POST',
      headers : {access_token : localStorage.getItem('access_token')},
      data : {title,description,due_date,status}
    }) 
    .done((response) => { 
      console.log(response)
      authentication()
    }) 
    .fail((err) => { 
      console.log(err)
    }) 
    .always(() => { 
      $('#add-title').val('')
      $('#add-description').val('')
      $('#add-due-date').val('')
      $('#add-status').val('') 
    })
  }) 

  $('#show-todos').click((event) => { 
    event.preventDefault()
    authentication()
  }) 
}) 

function toLoginForm() { 
  $('#reg-form').hide()
  $('#log-form').show() 
  $('#navbar').hide()
  $('#todos-table').hide() 
  $('#add-todo-form').hide()
} 

function toRegisterForm() { 
    $('#navbar').hide()
    $('#log-form').hide() 
    $('#reg-form').show()
} 

function authentication() {
    if(localStorage.access_token) { 
        $('#navbar').show() 
        $('#todos-table').show() 
        getTodos()
        $('#log-form').hide() 
        $('#reg-form').hide() 
        $('#add-todo-form').hide()
        $('#edit-todo-div').hide() 
        $('#weather-info').show() 
        getWeather() 
    } else { 
        $('#navbar').hide() 
        $('#todos-table').hide() 
        $('#log-form').show() 
        $('#reg-form').hide() 
        $('#add-todo-form').hide()
        $('#edit-todo-div').hide()
        $('#weather-info').hide() 
    }
} 

function toAddToDoForm () { 
  $('#add-todo-form').show()
  $('#navbar').show()
  $('#reg-form').hide()
  $('#log-form').hide()
  $('#todos-table').hide() 
} 

function getTodos() { 
  $.ajax({ 
    url : `${baseURL}/todos`,
    method : 'GET',
    headers : { 
      access_token : localStorage.getItem('access_token')
    }
  }) 
  .done((todos) => {  
    for (let i = 0 ; i < todos.length ; i ++) { 
      if (todos[i].status === true) { 
        $('#todos-table').append(` 
        <tr> 
          <td>${todos[i].title}</td>
          <td>${todos[i].description}</td>
          <td style="text-align: center;">${todos[i].status}</td>
          <td style="text-align: center;">${todos[i].due_date.split('T')[0]}</td> 
          <td><button type="button" onclick="editTodoForm(${todos[i].id})" class="btn btn-primary">Edit</button>&nbsp;&nbsp;<button type="button" onclick="deleteTodo(${todos[i].id})" class="btn btn-primary">Delete</button>&nbsp;&nbsp;<button type="button" onclick="changeTodoStatus(${todos[i].status},${todos[i].id})" class="btn btn-primary">Mark as undone</button></td>
        </tr> 
      `)
      } else {
        $('#todos-table').append(` 
        <tr> 
          <td>${todos[i].title}</td>
          <td>${todos[i].description}</td>
          <td style="text-align: center;">${todos[i].status}</td>
          <td style="text-align: center;">${todos[i].due_date.split('T')[0]}</td> 
          <td><button type="button" onclick="editTodoForm(${todos[i].id})" class="btn btn-primary">Edit</button>&nbsp;&nbsp;<button type="button" onclick="deleteTodo(${todos[i].id})" class="btn btn-primary">Delete</button>&nbsp;&nbsp;<button  type="button" onclick="changeTodoStatus(${todos[i].status},${todos[i].id})" class="btn btn-primary">Mark as Done</button></td>
        </tr> 
      `)
      }
    } 
    
  }) 
  .fail((err) => { 
    console.log(err)
  })
} 

function deleteTodo(id) { 
  $.ajax({ 
    url : `${baseURL}/todos/${id}`,
    method : 'DELETE',
    headers : { 
      access_token : localStorage.getItem('access_token')
    }
  }) 
  .done(() => { 
   authentication()
  }) 
  .fail((err) => { 
    console.log(err)
  }) 
} 

function editTodoForm(id) { 
  $.ajax({ 
    url : `${baseURL}/todos/${id}`,
    method : 'GET', 
    headers : { 
      access_token : localStorage.getItem('access_token')
    }
  }) 
  .done((todo) => { 
    $('#todos-table').hide()
    $('#edit-todo-div').show()
    if (todo.status === false) { 
      $('#edit-todo-form').append(` 
        <div class="row">
          <label for="edit-title" class="col-lg-3 col-form-label">Title</label>
          <div class="col-lg-9">
            <input type="text" class="form-control" id="edit-title" name="edit-title" value="${todo.title}"><br><br>
          </div>  
        </div>
        <div class="row">
          <label for="edit-description" class="col-lg-3 col-form-label">Description</label><br>
          <div class="col-lg-9">
            <input type="text" class="form-control" id="edit-description" name="edit-description" value="${todo.description}"><br><br>
          </div>
        </div> 
        <div class="row">
          <label for="edit-due-date" class="col-lg-3 col-form-label">Due Date</label><br>
          <div class="col-lg-9">  
            <input type="date" class="form-control" id="edit-due-date" name="edit-due-date" value="${todo.due_date.split('T')[0]}"><br><br> 
          </div>        
        </div> 
        <div class="row">  
          <label for="edit-status" class="col-lg-3 col-form-label">Status</label><br>
          <div class="col-lg-9">
            <input class="form-control" list="statusOptions" id="add-status">
              <datalist id="statusOptions">
                <option value="false" selected>false</option>
                <option value="true">true</option>
              </datalist><br><br>
          </div>  
        </div> 
        <button class="btn btn-primary" onclick="editTodo(${todo.id},{title:$('#edit-title').val(),description:$('#edit-description').val(),status:$('#edit-status').val(),due_date:$('#edit-due-date').val()})">Save</button>
    `)} else  { 
      $('#edit-todo-form').append(` 
        <div class="row">
          <label for="edit-title" class="col-lg-3 col-form-label">Title</label>
            <div class="col-lg-9">
              <input type="text" class="form-control" id="edit-title" name="edit-title" value="${todo.title}"><br><br>
            </div>  
        </div>
        <div class="row">
          <label for="edit-description" class="col-lg-3 col-form-label">Description</label><br>
          <div class="col-lg-9">
            <input type="text" class="form-control" id="edit-description" name="edit-description" value="${todo.description}"><br><br>
          </div>
        </div> 
        <div class="row">
          <label for="edit-due-date" class="col-lg-3 col-form-label">Due Date</label><br>
          <div class="col-lg-9">  
            <input type="date" class="form-control" id="edit-due-date" name="edit-due-date" value="${todo.due_date.split('T')[0]}"><br><br> 
          </div>        
        </div> 
        <div class="row">  
          <label for="edit-status" class="col-lg-3 col-form-label">Status</label><br>
          <div class="col-lg-9">
            <input class="form-control" list="statusOptions" id="add-status">
              <datalist id="statusOptions">
                <option value="false" >false</option>
                <option value="true" selected>true</option>
              </datalist><br><br>
          </div>  
        </div> 
        <button class="btn btn-primary" onclick="editTodo(${todo.id},{title:$('#edit-title').val(),description:$('#edit-description').val(),status:$('#edit-status').val(),due_date:$('#edit-due-date').val()})">Save</button>
    `)}
  }) 
  .fail((err) => { 
    console.log(err)
  })
}

function changeTodoStatus(currStatus,id) { 
  let newStatus
  if (currStatus === true) { 
    newStatus = false
  } else { 
    newStatus = true
  } 
  const update = { 
    status : newStatus
  } 
  $.ajax({ 
    url : `${baseURL}/todos/${id}`,
    method : 'PATCH',
    headers : {access_token : localStorage.getItem('access_token')},
    data : update
  }) 
  .then(() => { 
    authentication()
  }) 
  .fail((err) => { 
    console.log(err)
  })
} 

function editTodo(id,obj) { 
  const {title,description,status,due_date} = obj
  const updatedData = {title,description,status,due_date} 
  // console.log(id)
  // console.log(updatedData) 
  $.ajax({ 
    url : `${baseURL}/todos/${id}`,
    method :"PUT",
    headers : {access_token : localStorage.getItem('access_token')}, 
    data : updatedData
  })
  .done(() => { 
    authentication()
  }) 
  .fail((err) => { 
    console.log(err)
  })
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token
  console.log(id_token)
  $.ajax({ 
    url : `${baseURL}/user/googleLogin`,
    method : 'POST',
    data : {googleToken : id_token}
  }) 
  .done((response) => { 
    localStorage.setItem('access_token',response.access_token)
    authentication()
  }) 
  .fail((err) => { 
    console.log(err,'ini dari index.js di client kalo error')
  })
} 

function logOut() { 
  localStorage.removeItem('access_token')
  var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    }) 
  toLoginForm()
} 

function getWeather() { 
  $.ajax({ 
    url : `${baseURL}/weather`,
    method : 'GET',
    headers : { 
      access_token : localStorage.getItem('access_token')
    }
  }) 
  .done((response) => {  
    let weatherAndTemperature = ``
    let location = response[0].location 
    let temperature = response[0].temperature
    let time = response[0].time 
    let locationAndTime = `${location} ${time}`
    for (let i = 0 ; i < response[0].descriptions.length ; i ++) { 
      weatherAndTemperature +=`${response[0].descriptions[i]}`
    } 
    weatherAndTemperature +=` ${temperature} °C`
    $('#weather-and-temperature').text(weatherAndTemperature)
    $('#location-and-time').text(locationAndTime)
    console.log(response)
  }) 
  .fail((err) => { 
    console.log(err)
  })
}
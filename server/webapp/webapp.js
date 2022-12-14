const textbox = document.getElementById("textbox");
const subButton = document.getElementById("submit");

function getCookie(cookieName) {
  let cookie = {};
  document.cookie.split(' ').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  
  return cookie[cookieName];
};

function addCredentialsCookie() {
  document.cookie = `username=${document.getElementById("username").value} password=${document.getElementById("pwd").value}`;
  console.log(document.cookie );

  return true;
};

fetch('/list', {
  headers: {
    username: getCookie("username"),
    password: getCookie("password")
  }
})
.then(response => response.json())
.then(jsonData => {
  // loop over the objects in the JSON data and append them as divs to the document
  for (const obj of jsonData) {
    const div = document.createElement('div');
    div.innerHTML = `<h2>${obj.title}</h2><p>${obj.content}</p><p id="date">${obj.creation_date}</p>`;
    div.classList.add('note');
    
    document.getElementById('notes-table').appendChild(div);
  }
});

const hiddenUsername = document.getElementById("hiddenUsername");
const hiddenPassword = document.getElementById("hiddenPassword");

hiddenUsername.setAttribute("value", getCookie("username"));
hiddenPassword.setAttribute("value", getCookie("password"));



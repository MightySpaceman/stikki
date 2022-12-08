const textbox = document.getElementById("textbox");
const subButton = document.getElementById("submit");

fetch('/list')
  .then(response => response.json())
  .then(jsonData => {
    // loop over the objects in the JSON data and append them as divs to the document
    for (const obj of jsonData) {
      const div = document.createElement('div');
      div.innerHTML = `<h2>${obj.title}</h2><p>${obj.content}</p><p id="date">${obj.creation_date}</p>`;
      div.classList.add('note');

      div.onmouseover = () => {
        div.style.cursor = 'grab';
      }
      div.onclick = () => {
        window.location = `/note/:${obj.title}`;
      }
      
      document.getElementById('notes-table').appendChild(div);
    }
});



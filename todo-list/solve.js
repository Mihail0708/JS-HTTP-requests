function attachEvents() {
  const inputTitle = document.getElementById('title');
  const addBtn = document.getElementById('add-button');
  const loadBtn = document.getElementById('load-button');
  const ulList = document.getElementById('todo-list');
  const BASE_URL = 'http://localhost:3030/jsonstore/tasks/'
  
  loadBtn.addEventListener('click', loadHandler);
  addBtn.addEventListener('click', addHandler);

  function loadHandler(event) {
    if (event) {
        event.preventDefault();
    }
    ulList.innerHTML = '';

    fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
            for (const key in data) {
                const { name, _id } = data[key];
                const li = document.createElement('li');
                li.id = _id;
                const span = document.createElement('span');
                span.textContent = name;
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', removeHandler);
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.addEventListener('click', editHandler);
                li.appendChild(span);
                li.appendChild(removeBtn);
                li.appendChild(editBtn);
                ulList.appendChild(li);
            }
        })
  }

  function addHandler(event) {
    if (event) {
        event.preventDefault();
    }
    const name = inputTitle.value;
    const httpHeaders = {
        method: 'Post',
        body: JSON.stringify({ name })
    }

    fetch(BASE_URL, httpHeaders)
        .then(() => loadHandler())
    inputTitle.value = '';
  }

  function removeHandler() {
    const id = this.parentNode.id;
    const httpHeaders = {
        method: 'DELETE'
    }

    fetch(`${BASE_URL}${id}`, httpHeaders)
        .then(() => loadHandler())
  }

  function editHandler() {
    const parent = this.parentNode;
    const [ span, _removeBtn, editBtn] = Array.from(parent.children)
    const editInput = document.createElement('input');
    editInput.value = span.textContent;
    parent.prepend(editInput);
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    parent.appendChild(submitBtn);
    span.remove();
    editBtn.remove();
    submitBtn.addEventListener('click', submitHandler);
  }

  function submitHandler() {
    const id = this.parentNode.id;
    const parent = this.parentNode;
    const [ input ] = Array.from(parent.children);
    const httpHeaders = {
        method: 'PATCH',
        body: JSON.stringify({ name: input.value })
    }
    fetch(`${BASE_URL}${id}`, httpHeaders)
        .then(() => loadHandler())
    }
}
attachEvents();


function attachEvents() {
    const inputField = {
        title: document.getElementById('title'),
        description: document.getElementById('description'),
    }
    const BASE_URL = 'http://localhost:3030/jsonstore/tasks/'
    const otherEl = {
        loadBtn: document.getElementById('load-board-btn'),
        addTaskBtn: document.getElementById('create-task-btn'),
        todo: document.getElementById('todo-section'),
        inProgress: document.getElementById('in-progress-section'),
        codeReview: document.getElementById('code-review-section'),
        done: document.getElementById('done-section'),

    }

    otherEl.loadBtn.addEventListener('click', loadHandler);
    otherEl.addTaskBtn.addEventListener('click', addHandler);

    

    function loadHandler() {
        otherEl.todo.querySelector('.task-list').innerHTML = '';
        otherEl.inProgress.querySelector('.task-list').innerHTML = '';
        otherEl.codeReview.querySelector('.task-list').innerHTML = '';
        otherEl.done.querySelector('.task-list').innerHTML = '';

        fetch(BASE_URL)
            .then((res) => res.json())
            .then((data) => {
                for (const key in data) {
                    const { description, status, title, _id } = data[key];
                    if (status === 'ToDo') {
                        const ul = otherEl.todo.querySelector('.task-list');
                        const li = newElement('li', '', ul, _id, ['task']);
                        newElement('h3', title, li);
                        newElement('p', description, li);
                        const moveBtn = newElement('button', 'Move to In Progress', li);
                        moveBtn.addEventListener('click', moveHandler);
                        
                    } else if (status === 'In Progress') {
                        const ul = otherEl.inProgress.querySelector('.task-list');
                        const li = newElement('li', '', ul, _id, ['task']);
                        newElement('h3', title, li);
                        newElement('p', description, li);
                        const moveBtn = newElement('button', 'Move to Code Review', li);
                        moveBtn.addEventListener('click', moveHandler);

                    } else if (status === 'Code Review') {
                        const ul = otherEl.codeReview.querySelector('.task-list');
                        const li = newElement('li', '', ul, _id, ['task']);
                        newElement('h3', title, li);
                        newElement('p', description, li);
                        const moveBtn = newElement('button', 'Move to Done', li);
                        moveBtn.addEventListener('click', moveHandler);

                    }else if (status === 'Done') {
                        const ul = otherEl.done.querySelector('.task-list');
                        const li = newElement('li', '', ul, _id, ['task']);
                        newElement('h3', title, li);
                        newElement('p', description, li);
                        const moveBtn = newElement('button', 'Close', li);
                        moveBtn.addEventListener('click', moveHandler);

                    }

                }
            })
    }

    function addHandler () {
        const title = inputField.title.value;
        const description = inputField.description.value;
        const httpHeaders = {
            method: 'POST',
            body: JSON.stringify({ title, description, status: 'ToDo'})
        }
        fetch(BASE_URL, httpHeaders)
            .then(() => loadHandler())
        inputField.title.value = '';
        inputField.description.value = '';
    }

    function newElement (type, content, parent, id, classes, attributes, innerHtml) {
		const htmlElement = document.createElement(type);

		if (content && innerHtml){
			htmlElement.innerHTML = content;
		} else {
			if (content && type !== 'input') {
				htmlElement.textContent = content;
			}
			if (content && type === 'input') {
				htmlElement.value = content;
			}
		}
	
		if (id) {
			htmlElement.id = id;
		}
	
		if (classes && classes.length > 0) {
			htmlElement.classList.add(...classes);
		}
	
		if (attributes) {
			for (const key in attributes) {
				htmlElement[key] = attributes[key];
			}
		}

		if (parent) {
			parent.appendChild(htmlElement);
		}

		return htmlElement;
	}

    function moveHandler () {
        const text = this.textContent;
        const id = this.parentNode.id
        if (text === 'Move to In Progress') {
            const httpHeaders = {
                method: 'PATCH',
                body: JSON.stringify({ status: 'In Progress'})
            }
            fetch(`${BASE_URL}${id}`, httpHeaders)
                .then(() => loadHandler())
        }else if (text === 'Move to Code Review') {
            const httpHeaders = {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Code Review'})
            }
            fetch(`${BASE_URL}${id}`, httpHeaders)
                .then(() => loadHandler())
        }else if (text === 'Move to Done') {
            const httpHeaders = {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Done'})
            }
            fetch(`${BASE_URL}${id}`, httpHeaders)
                .then(() => loadHandler())
        }else if (text === 'Close') {
            const httpHeaders = {
                method: 'DELETE',
            }
            fetch(`${BASE_URL}${id}`, httpHeaders)
                .then(() => loadHandler())
        }
    }
}

attachEvents();
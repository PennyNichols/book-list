const form = document.querySelector(".form");
const alert = document.querySelector(".alert");
const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const isbnInput = document.getElementById("isbn-input");
const entry = document.querySelectorAll(".item");

const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".list-container");
const list = document.querySelector(".list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editAuthor;
let editISBN;
let editFlag = false;
let editID = "";

const addItem = (e) => {
	e.preventDefault();
	const value = titleInput.value;
	const author = authorInput.value;
	const isbn = isbnInput.value;
	const id = new Date().getTime().toString();

	if (value !== "" && !editFlag) {
		const element = document.createElement("article");
		let attr = document.createAttribute("data-id");
		attr.value = id;
		element.setAttributeNode(attr);
		element.classList.add("list-item");
		element.innerHTML = `<p class="title item">${value}</p>
            <p class="author">${author}</p>
            <p class="isbn">${isbn}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
		const deleteBtn = element.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", deleteItem);
		const editBtn = element.querySelector(".edit-btn");
		editBtn.addEventListener("click", editItem);

		list.appendChild(element);
		displayAlert("book added", "success");
		container.classList.add("show-container");
		addToLocalStorage(id, value, author, isbn);
		setBackToDefault();
	} else if (value !== "" && editFlag) {
		editElement.innerHTML = value;
		editAuthor.innerHTML = author;
		editISBN.innerHTML = isbn;
		displayAlert("entry altered", "success");

		editLocalStorage(editID, value, author, isbn);
		setBackToDefault();
	} else {
		displayAlert("please input information", "danger");
	}
};
const displayAlert = (text, action) => {
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);
	// remove alert
	setTimeout(function () {
		alert.textContent = "";
		alert.classList.remove(`alert-${action}`);
	}, 1000);
};

const clearItems = () => {
	const items = document.querySelectorAll(".list-item");
	if (items.length > 0) {
		items.forEach(function (item) {
			list.removeChild(item);
		});
	}
	container.classList.remove("show-container");
	displayAlert("list cleared", "danger");
	setBackToDefault();
	localStorage.removeItem("list");
};

const deleteItem = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;

	list.removeChild(element);

	if (list.children.length === 0) {
		container.classList.remove("show-container");
	}
	displayAlert("book removed", "danger");

	setBackToDefault();
	removeFromLocalStorage(id);
};

const editItem = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	editElement =
		e.currentTarget.parentElement.previousElementSibling.previousElementSibling
			.previousElementSibling;
	editAuthor =
		e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
	editISBN = e.currentTarget.parentElement.previousElementSibling;
	titleInput.value = editElement.innerHTML;
	authorInput.value = editAuthor.innerHTML;
	isbnInput.value = editISBN.innerHTML;
	editFlag = true;
	editID = element.dataset.id;
	submitBtn.textContent = "edit";
};
const setBackToDefault = () => {
	titleInput.value = "";
	authorInput.value = "";
	isbnInput.value = "";
	editFlag = false;
	editID = "";
	submitBtn.textContent = "submit";
};

const addToLocalStorage = (id, value, author, isbn) => {
	const titleInput = { id, value, author, isbn };
	let items = getLocalStorage();
	items.push(titleInput);
	localStorage.setItem("list", JSON.stringify(items));
};

const getLocalStorage = () => {
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
};

const removeFromLocalStorage = (id) => {
	let items = getLocalStorage();

	items = items.filter(function (item) {
		if (item.id !== id) {
			return item;
		}
	});

	localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value, author, isbn) => {
	let items = getLocalStorage();

	items = items.map(function (item) {
		if (item.id === id) {
			item.value = value;
			item.author = author;
			item.isbn = isbn;
		}
		return item;
	});
	localStorage.setItem("list", JSON.stringify(items));
};

const setupItems = () => {
	let items = getLocalStorage();

	if (items.length > 0) {
		items.forEach(function (item) {
			createListItem(item.id, item.value, item.author, item.isbn);
		});
		container.classList.add("show-container");
	}
};

const createListItem = (id, value, author, isbn) => {
	const element = document.createElement("article");
	let attr = document.createAttribute("data-id");
	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add("list-item");
	element.innerHTML = `<p class="title">${value}</p>
            <p class="author">${author}</p>
            <p class="isbn">${isbn}</p>
            <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
            </div>
        `;
	const deleteBtn = element.querySelector(".delete-btn");
	deleteBtn.addEventListener("click", deleteItem);
	const editBtn = element.querySelector(".edit-btn");
	editBtn.addEventListener("click", editItem);

	list.appendChild(element);
};

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

const form = document.querySelector(".form");
const alert = document.querySelector(".alert");
const listInput = document.getElementById("list-input");
const priceInput = document.getElementById("price-input");
const qtyInput = document.getElementById("qty-input");
const entry = document.querySelectorAll(".item")


const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".list-container");
const list = document.querySelector(".list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editPrice;
let editQty;
let editTotal;
let editFlag = false;
let editID = "";

const addItem = (e) => {
    e.preventDefault();
	const value = listInput.value;
    const price = priceInput.value;
    const qty = qtyInput.value;
    const total = (((price * 100) * qty) / 100).toFixed(2);
	const id = new Date().getTime().toString();

	if (value !== "" && !editFlag) {
		const element = document.createElement("article");
		let attr = document.createAttribute("data-id");
		attr.value = id;
		element.setAttributeNode(attr);
		element.classList.add("list-item");
		element.innerHTML = `<p class="title item">${value}</p>
            <p class="price">${price}</p>
            <p class="qty">${qty}</p>
            <p class="total">${total}</p>
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
		displayAlert("item added", "success");
		container.classList.add("show-container");
		addToLocalStorage(id, value, price, qty, total);
		setBackToDefault();
	} else if (value !== "" && editFlag) {
		editElement.innerHTML = value;
        editPrice.innerHTML = price;
        editQty.innerHTML = qty;
        editTotal.innerHTML = total;
		displayAlert("item altered", "success");

		editLocalStorage(editID, value, price, qty, total);
		setBackToDefault();
	} else {
		displayAlert("please input item", "danger");
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
	displayAlert("item removed", "danger");

	setBackToDefault();
	removeFromLocalStorage(id);
};


// how to add price, qty, and total to editItem???

const editItem = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	editElement = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
	editPrice = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
	editQty = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
	editTotal = e.currentTarget.parentElement.previousElementSibling;
	listInput.value = editElement.innerHTML;
	priceInput.value = editPrice.innerHTML;
	qtyInput.value = editQty.innerHTML;
	editTotal.innerHTML = priceInput.value * qtyInput.value;
	editFlag = true;
	editID = element.dataset.id;
	submitBtn.textContent = "edit";
};
const setBackToDefault = () => {
	listInput.value = "";
    priceInput.value = "";
    qtyInput.value = "";
	editFlag = false;
	editID = "";
	submitBtn.textContent = "submit";
};

const addToLocalStorage = (id, value, price, qty, total) => {
	const listInput = { id, value, price, qty, total };
	let items = getLocalStorage();
	items.push(listInput);
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

const editLocalStorage = (id, value, price, qty, total) => {
	let items = getLocalStorage();

	items = items.map(function (item) {
		if (item.id === id) {
			item.value = value;
			item.price = price;
			item.qty = qty;
			item.total = total;
		}
		return item;
	});
	localStorage.setItem("list", JSON.stringify(items));
};

const setupItems = () => {
	let items = getLocalStorage();

	if (items.length > 0) {
		items.forEach(function (item) {
			createListItem(item.id, item.value, item.price, item.qty, item.total);
		});
		container.classList.add("show-container");
	}
};

const createListItem = (id, value, price, qty, total) => {
	const element = document.createElement("article");
	let attr = document.createAttribute("data-id");
	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add("list-item");
	element.innerHTML = `<p class="title">${value}</p>
            <p class="price">${price}</p>
            <p class="qty">${qty}</p>
            <p class="total">${total}</p>
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

const strike = (e) => {
    
} 


entry.addEventListener("click", strike)
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

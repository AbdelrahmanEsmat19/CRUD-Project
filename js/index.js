const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategoryInput = document.getElementById('productCategory');
const productImageInput = document.getElementById('productImage');
const addButton = document.getElementById('addButton');
const editBtn = document.getElementById('editBtn')
const labelModal = document.getElementById('exampleModalLabel')
const updateButton = document.getElementById('updateButton');
const modal = document.getElementById('exampleModal')
const searchInput = document.getElementById('searchInput');
const newBtn = document.getElementById('newProductButtton')
const productsContainer = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
displayProduct();
var indexUpdate;
addButton.addEventListener('click', addProduct)
updateButton.addEventListener('click', updateProduct)


function clearAlertsClasses() {
    document.getElementById('ProductAlert').classList.replace('d-block', 'd-none');
    document.getElementById('priceAlert').classList.replace('d-block', 'd-none');
    document.getElementById('imageAlert').classList.replace('d-block', 'd-none');
    document.getElementById('priceCategory').classList.replace('d-block', 'd-none');

}
function clearFormAndValidation() {
    productNameInput.classList.remove("is-valid", "is-invalid");
    productPriceInput.classList.remove("is-valid", "is-invalid");
    productCategoryInput.classList.remove("is-valid", "is-invalid");
    productImageInput.classList.remove("is-valid", "is-invalid");

    productNameInput.value = '';
    productPriceInput.value = '';
    productCategoryInput.value = '';
    productImageInput.value = '';

    document.getElementById('ProductAlert').classList.replace('d-block', 'd-none');
    document.getElementById('priceAlert').classList.replace('d-block', 'd-none');
    document.getElementById('imageAlert').classList.replace('d-block', 'd-none');
    document.getElementById('priceCategory').classList.replace('d-block', 'd-none');
}


function addProduct() {
    if (validateInputs(productNameInput) && validateInputs(productPriceInput) && validateInputs(productCategoryInput) && validateInputs(productImageInput)) {
        var products = {
            name: productNameInput.value,
            price: productPriceInput.value,
            image: `images/${productImageInput.files[0].name}`,
            category: productCategoryInput.value,
        };
        productsContainer.push(products);
        displayProduct();
        localStorage.setItem("products", JSON.stringify(productsContainer));
        clearFormAndValidation();
        bootstrap.Modal.getInstance(modal).hide();

    }
}
function updateProduct() {
    if (validateInputs(productNameInput) && validateInputs(productPriceInput) && validateInputs(productCategoryInput) && validateInputs(productImageInput)) {
        productsContainer[indexUpdate].name = productNameInput.value;
        productsContainer[indexUpdate].price = productPriceInput.value;
        productsContainer[indexUpdate].category = productCategoryInput.value;
        productsContainer[indexUpdate].image = `images/${productImageInput.files[0].name}`;
        bootstrap.Modal.getInstance(modal).hide();
        updateButton.classList.add('d-none');
        addButton.classList.remove('d-none');
        displayProduct();
        localStorage.setItem("products", JSON.stringify(productsContainer));
        clearFormAndValidation();
    }
}
function deleteProduct(index) {
    productsContainer.splice(index, 1);
    displayProduct();
    localStorage.setItem('products', JSON.stringify(productsContainer));
}

modal.addEventListener('hidden.bs.modal', () => {
    addButton.classList.remove('d-none');
    updateButton.classList.add('d-none');
    clearFormAndValidation();
    clearAlertsClasses();
    indexUpdate = undefined;
});

function displayProduct() {
    var productsBox = '';
    for (var i = 0; i < productsContainer.length; i++) {
        productsBox += `
        <tr>
        <td>${i + 1}</td>
        <td>${productsContainer[i].newName ? productsContainer[i].newName : productsContainer[i].name}</td>
        <td>${productsContainer[i].price}</td>
        <td>${productsContainer[i].category}</td>
        <td><img src="${productsContainer[i].image}" alt=""></td>
        <td>
          <button id="editBtn" onclick="updateButtons(${i})" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pen text-warning me-2"></i> </button>
          <button onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can text-danger"></i> </button></td>
      </tr>
`;
    }
    document.getElementById('rowData').innerHTML = productsBox;
}


function updateButtons(i) {
    indexUpdate = i;
    addButton.classList.add('d-none');
    updateButton.classList.remove('d-none');

    productNameInput.value = productsContainer[i].name;
    productPriceInput.value = productsContainer[i].price;
    productCategoryInput.value = productsContainer[i].category;
    productImageInput.value = productsContainer[i].image;

}

function validateInputs(element) {
    var regex = {
        productName: /^[A-Z][a-z ]{1,15}\d*[a-z]?$/,
        productPrice: /^[1-9][0-9]{4,6}$/,
        productCategory: /^(Mobile|TV|Laptop|Watch)$/,
        productImage: /\.(jpg|jpeg|png)$/i,
    };
    var isValid = regex[element.id].test(element.value);
    var alertElement = element.id === 'productName' ? document.getElementById('ProductAlert') : element.id === 'productPrice' ? document.getElementById('priceAlert') : element.id === 'productImage' ? document.getElementById('imageAlert') : document.getElementById('priceCategory');


    if (isValid) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        alertElement.classList.replace('d-block', 'd-none');
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        alertElement.classList.replace('d-none', 'd-block');
    }
    return isValid;
}
function searchProduct() {
    var searchInput = document.getElementById("searchInput");
    var word = searchInput.value.trim();
    var searchValue = [];
    var productsBox = "";

    for (let i = 0; i < productsContainer.length; i++) {
        const product = productsContainer[i];
        const regex = new RegExp(word, "gi");
        if (product.name.toLowerCase().includes(word.toLowerCase())) {
            searchValue.push(product);
            product.newName = product.name.replace(regex, (match) => {
                return `<span class='text-danger fw-bold'>${match}</span>`;
            });

            productsBox += `
                  <tr>
                  <td>${i + 1}</td>
                  <td>${product.newName ? product.newName : product.name}</td>
                  <td>${product.price}</td>
                  <td>${product.category}</td>
                  <td><img src="${product.image}" alt=""></td>
                  <td>
                    <button onclick="updateButtons(${i})"><i class="fa-solid fa-pen text-warning me-2" ></i> </button>
                    <button onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can text-danger"></i> </button></td>
                </tr>
              `;
            displayProduct(searchValue);


        }
    }
    document.getElementById("rowData").innerHTML = productsBox;
}

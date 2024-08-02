const url = 'http://127.0.0.1:3000/api/products';

const productHTML = (product) => {
    return `<div class="product">
<p class="product-id"> Product ID: ${product.id}</p>
<h2> Name: ${product.name}</h2>
<h2> Price: ${product.price}</h2>
<h2> Image: ${product.imgurl}</h2>
</div>`;
}

const productsHTML = products => `<div id="products">${products.map(product => productHTML(product)).join("")}</div>`;

const inputHTML = product => {
    return `<input id="name" placeholder="Product name" value="${product.name}">
<input id="price" placeholder=Product price" value="${product.price}">
<input id="img" placeholder="Image" value="${product.imgurl}">
`};

const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;

const formHTML = (product, add) => {
    return `<form id="form" data-id="${product.id}">
${inputHTML(product)}
${add ? buttonHTML("Add", "POST") : buttonHTML("Save", "PATCH") + buttonHTML("Replace", "PUT") + buttonHTML("Remove", "DELETE")}
</form>`
}
    ;

const fetchData = async (url, id, method = "GET", body = { name: "", price: "", imgurl: "" }) => {

    if (method === "POST" && body.name === "" && body.price === "") {
        console.log("Empty name is not valid when creating a new product");
        return;
    }
    try {
        const response = await fetch(id !== undefined && !isNaN(id) ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();

    } catch (error) {
        console.error(error);
    }
}

const main = async _ => {
    const root = document.getElementById("root");
    const products = await fetchData(url);
    root.insertAdjacentHTML("beforeend", productsHTML(products));
    root.insertAdjacentHTML("beforeend", formHTML({ id: "", name: "", price: "", imgurl: "" }, true));
    window.addEventListener("click", handleClick);
    window.addEventListener("input", handleInput);
    window.addEventListener("submit", handleSubmit);
};

const handleInput = ({ target }) => {
    target.setAttribute("value", target.value);
}

const handleSubmit = async e => {
    e.preventDefault();
    console.log(e.target);

    const method = e.submitter.getAttribute("data-method");
    const id = parseInt(e.target.getAttribute("data-id"));
    console.log(id);

    const result = await fetchData(
        url,
        id,
        method,
        method === "PATCH" ?
            {
                name: document.getElementById('name').value,
                price: document.getElementById('price').value,
                imgurl: document.getElementById('img').value
            } :
        method === "PUT" ?
            {
                name: document.getElementById('name').value,
                price: document.getElementById('price').value,
                imgurl: document.getElementById('img').value
            } :
        method === "DELETE" ?
            { id } :
        method === "POST" ?
            {
                name: document.getElementById('name').value,
                price: document.getElementById('price').value,
                imgurl: document.getElementById('img').value
            } :
            { name: " ", price: "", imgurl:"" }
    );


    document.getElementById("products").outerHTML = "";
    document.getElementById("form").outerHTML = "";
    const root = document.getElementById("root");
    const products = await fetchData(url);
    root.insertAdjacentHTML("beforeend", productsHTML(products));
    root.insertAdjacentHTML("beforeend", formHTML({ id: "", name: "", price: "", imgurl: "" }, true));

}

const handleClick = async ({ target }) => {
    const productTarget = target.classList.contains('product') ? target : target.closest('.product');

    if (productTarget) {
        const productsId = productTarget.querySelector('.product-id').textContent.split(": ")[1];
        const productData = await fetchData(url, productsId);
        console.log(productData);

        //const inputElement = document.querySelector('input');
        //inputElement.value = userData.name;

        document.getElementById('form').dataset.id = productsId;
        document.getElementById("form").outerHTML = formHTML(productData);
    }
};

window.addEventListener("load", main);
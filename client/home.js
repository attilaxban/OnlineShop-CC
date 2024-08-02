
let productCart =[];
document.addEventListener("DOMContentLoaded", () => {
    console.log(window.location.pathname);

    const mainElement = document.getElementById('main');
    let cart = [];
    let item = [];
    let totalPrice = 0;

    const currentPath = window.location.pathname;
    if (currentPath === "/home/") {
        console.log("Home");
        fetch('http://127.0.0.1:3000/api/products')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.forEach(element => {
                    displayProduct(element);
                });
            });
        mainElement.addEventListener('click', function (event) {
            if (event.target.classList.contains('add-to-cart')) {
                const productElement = event.target.parentNode;
                const title = productElement.querySelector('img').alt;
                cart.push(title);

                const product = event.target.parentNode.textContent.split("\n")
                const productName = product[2].split(" ")
                const itemName = (productName[productName.length-1])
                console.log(itemName);
                productCart.push(event.target.parentNode.textContent);
                localStorage.setItem('cartItems', JSON.stringify(cart));
                localStorage.setItem('itemCart', JSON.stringify(itemName));

                event.target.disabled = true;
                event.target.textContent = "Added"
            }
        });
    }


    if (currentPath === "/cart/") {
        console.log("Cart");
        console.log(cart);
        console.log(productCart);
        const savedCart = JSON.parse(localStorage.getItem('cartItems'));
        if (savedCart) {
            cart = savedCart;
            displayCartItems();
            console.log(cart);
        }
        const savedItem = JSON.parse(localStorage.getItem('itemCart'));
        if (savedItem) {
            item = savedItem;
            console.log(item);
        }
        document.querySelector('ul').insertAdjacentHTML('beforeend', `<p id="totalPrice"></p>`);
        mainElement.insertAdjacentHTML('beforeend', `<button id="go-to-payment" onclick="location.href='http://127.0.0.1:3000/payment/'" type="button">
        Buy</button></div>`);
        window.addEventListener('click', function (event) {

            if (event.target.classList.contains('go-to-payment')) {
                this.window.open('http://127.0.0.1:3000/payment/')
            }

            if (event.target.classList.contains('remove-cart-item')) {
                const productElement = event.target.parentNode;
                const title = productElement.querySelector('img').alt;


                cart = cart.filter(item => item !== title);

                mainElement.innerHTML = `<button id="go-to-payment" onclick="location.href='http://127.0.0.1:3000/payment/'" type="button">
                Buy</button></div>`;
                totalPrice = 0;
                displayCartItems();
                localStorage.setItem('cartItems', JSON.stringify(cart));
            }

        })
    }
    if (currentPath === "/contact/") {
        console.log("Contact");
        mainElement.insertAdjacentHTML('beforeend', `<div id= contact>
            HRB Webshop<br>
            Email: hrb@hrb-info.com<br>
            Location: 1234 Example example str. 145<br>
        </div>`)
    }
    if (currentPath === "/register/") {
        mainElement.insertAdjacentHTML('beforeend', `  
            <form id="register-form" >
                <label for="fullname">Full name:</label>
                <input type="text" id="fullname" name="fullname" placeholder="Write your name here!" required><br><br>
            
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" placeholder="Write your username here!" required><br><br>
            
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Write your email here!" required><br><br>
            
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Write your password here!" required><br>
                <input id="register" type="submit" onclick="location.href='http://127.0.0.1:3000/register-succes/'"  value="Register" />
                </form>`);
        document.querySelector("#register-form").addEventListener("submit", async (e) => {
            e.preventDefault()
            let resp = await fetch("http://127.0.0.1:3000/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: e.target.fullname.value,
                    username: e.target.username.value,
                    email: e.target.email.value,
                    password: e.target.password.value


                })
            })

            let data = await resp.json()

            console.log(data);
        })
    }

    if (currentPath === "/login/") {
        console.log("Login");

        mainElement.insertAdjacentHTML('beforeend', `  
    <form id="login-form">
      <label for="username">Username:</label>
      <input type="username" id="username" name="username" required><br><br>
  
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
  
      <input id="login" type="submit"  value="Login" />
      <input id="reg" type="button" onclick="location.href='http://127.0.0.1:3000/register/'" value="Registration" />
  </form>`)
        //onclick="location.href='http://127.0.0.1:3000/home/'"
        document.querySelector('#login-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log(e.target.username.value + " " + e.target.password.value);
            let resp = await fetch('http://127.0.0.1:3000/api/users')
            let data = await resp.json()
            console.log(data);
            let isUserFound = false;

            data.forEach(user => {
                if (user.username === e.target.username.value && user.password === e.target.password.value) {
                    isUserFound = true;
                }
            });

            if (isUserFound) {
                window.location.href = 'http://127.0.0.1:3000/home/';
            } else {
                const errorMessage = document.querySelector('.error-message');
                if (!errorMessage) {
                    mainElement.insertAdjacentHTML('beforeend', `<p class="error-message">Wrong username or password. Please try again or register!</p>`);
                }
            }


        })
    }

    const loginButton = document.querySelector('#login');

    if (currentPath === "/payment/") {
        const savedItem = JSON.parse(localStorage.getItem('itemCart'));
        
            console.log(savedItem);
        
        
        mainElement.insertAdjacentHTML('beforeend', `
        <form id="shipping-form">
    <label for="fullname">Full name:</label>
    <input type="text" id="full-name" name="fullname" required><br><br>

    <label for="address">Address:</label>
    <input type="text" id="address" name="address" required><br><br>

    <label for="city">City:</label>
    <input type="text" id="city" name="city" required><br><br>

    <label for="zipcode">Zip Code:</label>
    <input type="text" id="zip-code" name="zipcode" required><br><br>

    <label for="payment">Payment:</label>
    <select id="payment" name="payment" required>
        <option value="">Choose payment</option>
        <option value="cash">Cash</option>
        <option value="card">Mastercard</option>
    </select><br><br>

    <label for="items">Items:</label>
    <input type="text" id="items" name="items" value="${savedItem}" required>

    <input id="sub" type="submit" value="Buy">
</form>
        `)
        let orderPlaced = false;
        document.querySelector("#shipping-form").addEventListener("submit", async (e) => {
            window.location.href = 'http://127.0.0.1:3000/succes-payment/'
            e.preventDefault()
            let resp = await fetch("http://127.0.0.1:3000/payment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: e.target.fullname.value,
                    address: e.target.address.value,
                    city: e.target.city.value,
                    zipcode: e.target.zipcode.value,
                    payment: e.target.payment.value,
                    items: e.target.items.value

                })
            })

            let data = await resp.json()

           
            

            console.log(data);
        })
    }
    if (currentPath === "/succes-payment/") {
        mainElement.insertAdjacentHTML('beforeend', `<div><p>Thank you for shopping. Your order will arrive as soon as possible. (3-5 days)</p><br><button id="back-to-shopping" onclick="location.href='http://127.0.0.1:3000/home/'" type="button">
        Back to shopping</button></div>`)

    }
    if (currentPath === "/register-succes/") {
        mainElement.insertAdjacentHTML('beforeend', `<div><p>Thank you! Now you can login and start shopping</p><br><button id="login" onclick="location.href='http://127.0.0.1:3000/login/'" type="button">
        Login</button></div>`)
    }





    function displayProduct(datas) {
        mainElement.insertAdjacentHTML('beforeend', `
            <div class="product">
                <img src=${datas.imgurl} alt="${datas.id}"></img><br>
                ${datas.name}<br>
                ${datas.price}<br>
                <button class="add-to-cart">Add to cart</button>
            </div>
        `);


    }

    function displayCartProduct(datas) {
        totalPrice += Number(datas.price);
        document.getElementById('totalPrice').innerHTML = `Total price: ${Math.trunc(totalPrice * 100) / 100}`
        mainElement.insertAdjacentHTML('beforeend', `
            <div class="product">
                <img src=${datas.imgurl} alt="${datas.id}"></img><br>
                ${datas.name}<br>
                ${datas.price}<br>
                <button class="remove-cart-item">Remove from cart</button>
            </div>
        `);
    }





    //fetch ID alapján 
    function displayCartItems() {
        cart.forEach(item => {
            fetchData(`http://127.0.0.1:3000/api/products/${item}`).then(product => {
                displayCartProduct(product);
            });
        });
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            return console.error('Fetch error:', error);
        }
    }
});

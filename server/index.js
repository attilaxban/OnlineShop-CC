import express from "express";
import fs from "fs/promises";

import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../client")));




app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
})

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});
app.get('/succes-payment', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});
app.get('/register-succes/', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
})
// app.get('/private-page/:password/:username',(req,res) =>{
//     const data = fs.readFile('./users.json','utf8');
//     const users = JSON.parse(data);

//     const findUsers = users.find(user => user.username === req.params.username && user.password === req.params.password);

//     if(findUsers){
//       res.sendFile(path.join(__dirname, "../client/home.html"));
//     }else{
//       res.sendFile(path.join(__dirname, "../client/home.html"));
//     }
// })





app.get('/api/products', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const products = JSON.parse(data).products;
  return res.send(products);
});

app.get('/api/products/:productId', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const { products } = JSON.parse(data);
  const productId = parseInt(req.params.productId);
  const product = products.find(product => product.id === productId);
  if (product) {
    return res.send(product);
  } else {
    return res.status(404).send({ state: 'Product not found' });
  }
});

app.post('/api/products', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const { products } = JSON.parse(data);
  const productIds = products.map(product => product.id);
  const maxId = Math.max(...productIds);
  const newProducts =
  {

    id: maxId + 1,
    name: req.body.name,
    price: req.body.price,
    imgurl: req.body.imgurl,

  }
  products.push(newProducts);
  await fs.writeFile('./products.json', JSON.stringify({ products }), 'utf8');
  return res.send(newProducts);
});

app.patch('/api/products/:productId', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const { products } = JSON.parse(data);
  const productId = parseInt(req.params.productId);
  const product = products.find(product => product.id === productId);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.imgurl = req.body.imgurl;


    await fs.writeFile('./products.json', JSON.stringify({ products }), 'utf8');
    return res.send(product);
  } else {
    return res.status(404).send({ state: 'Product not found' });
  }
});

app.put('/api/products/:productId', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const { products } = JSON.parse(data);
  const productId = parseInt(req.params.productId);
  const product = products.find(product => product.id === productId);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.imgurl = req.body.imgurl;


    await fs.writeFile('./products.json', JSON.stringify({ products }), 'utf8');
    return res.send(product);
  } else {
    return res.status(404).send({ state: 'Product not found' });
  }
});

app.delete('/api/products/:productId', async (req, res) => {
  const data = await fs.readFile('./products.json', 'utf8');
  const { products } = JSON.parse(data);
  const productId = parseInt(req.params.productId);
  const product = products.find(product => product.id === productId);

  if (product) {
    const newProduct = products.filter((x) => x !== product);
    await fs.writeFile('./products.json', JSON.stringify({ products: newProduct }), 'utf8');
    return res.send({ state: "204 No content" });
  } else {
    return res.status(404).send({ state: 'Product not found' });
  }
});

app.get("/edit/products", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
})


app.post('/register', async(req,res) =>{
  const data = await fs.readFile('./users.json','utf8');
  const users = JSON.parse(data);
  
  const newUser = {
    fullname : req.body.fullname,
    username: req.body.username,
    email:req.body.email,
    password: req.body.password
  }

  users.push(newUser);

  await fs.writeFile('./users.json', JSON.stringify(users), 'utf8');

})

app.get('/api/users', async (req, res) => {
  const data = await fs.readFile('./users.json', 'utf8');
  const users = JSON.parse(data);
  return res.send(users);
});

app.get('/api/orders', async (req, res) => {
  const data = await fs.readFile('./orders.json', 'utf8');
  const orders = JSON.parse(data);
  return res.send(orders);
});

app.post('/payment', async(req,res) =>{
  const data = await fs.readFile('./orders.json','utf8');
  const order = JSON.parse(data);
 
  const newOrder = {
    fullname : req.body.fullname,
    address: req.body.address,
    city:req.body.city,
    zipcode: req.body.zipcode,
    payment:req.body.payment,
    items:req.body.items
  }

  order.push(newOrder);

  await fs.writeFile('./orders.json', JSON.stringify(order), 'utf8');

})



app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('./users.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error reading users data.' });
      return;
    }

    try {
      const users = JSON.parse(data);
      const foundUser = users.find(user => user.username === username && user.password === password);

      if (foundUser) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Incorrect username or password.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error parsing users data.' });
    }
  });
});





app.listen(3000, () => {
  console.log(`Open this link in your browser: http://127.0.0.1:3000/login/`);
});
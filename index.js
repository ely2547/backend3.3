
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./product"); // Importamos el modelo de producto

// Creamos el servidor
const app = express();

// Configuramos el puerto
const PORT = process.env.PORT || 3001;

// Conectamos con la base de datos
mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority'
)
.then(() => console.log("Database connected"))
.catch((err) => console.error(err));

// Usamos el middleware cors para permitir el acceso cruzado
app.use(cors());

// Usamos el middleware express.json para parsear el cuerpo de las peticiones
app.use(express.json());

// Definimos las rutas

// Ruta para obtener todos los productos
app.get("/products", (req, res) => {
  // Obtenemos el filtro de búsqueda de la query
  const filter = req.query.filter || "";

  // Buscamos los productos que coincidan con el filtro por nombre, categoría o descripción
  Product.find({
    $or: [
      { name: { $regex: filter, $options: "i" } },
      { category: { $regex: filter, $options: "i" } },
      { description: { $regex: filter, $options: "i" } },
    ],
  })
    .then((products) => res.json(products)) // Enviamos los productos como respuesta
    .catch((err) => res.status(500).json({ message: err.message })); // Enviamos el error como respuesta
});

// Ruta para crear un nuevo producto
app.post("/products", (req, res) => {
  // Obtenemos los datos del producto del cuerpo de la petición
  const { name, description, price, quantity, category, image } = req.body;

  // Creamos un nuevo producto con esos datos
  const newProduct = new Product({
    name,
    description,
    price,
    quantity,
    category,
    image,
  });

  // Guardamos el producto en la base de datos
  newProduct
    .save()
    .then((product) => res.json(product)) // Enviamos el producto como respuesta
    .catch((err) => res.status(500).json({ message: err.message })); // Enviamos el error como respuesta
});

// Ruta para actualizar un producto existente
app.put("/products/:id", (req, res) => {
  // Obtenemos el id del producto de los parámetros de la ruta
  const id = req.params.id;

  // Obtenemos los datos actualizados del producto del cuerpo de la petición
  const { name, description, price, quantity, category, image } = req.body;

  // Buscamos el producto por su id y lo actualizamos con los nuevos datos
  Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    quantity,
    category,
    image,
  })
    .then((product) => res.json(product)) // Enviamos el producto como respuesta
    .catch((err) => res.status(500).json({ message: err.message })); // Enviamos el error como respuesta
});

// Ruta para eliminar un producto existente
app.delete("/products/:id", (req, res) => {
  // Obtenemos el id del producto de los parámetros de la ruta
  const id = req.params.id;

  // Buscamos el producto por su id y lo eliminamos de la base de datos
  Product.findByIdAndDelete(id)
    .then((product) => res.json(product)) // Enviamos el producto como respuesta
    .catch((err) => res.status(500).json({ message: err.message })); // Enviamos el error como respuesta
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await user.save();

  res.json({ message: 'User registered successfully' });
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por id
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un usuario por id
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un usuario por id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciamos el servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./rutas/prices'));
app.use('/', require('./rutas/promotions'));
app.use('/', require('./rutas/reservas'));
app.use('/', require('./rutas/services'));


app.listen(process.env.PORT || 3001, () => {
  console.log("servidor corriendo...");
});
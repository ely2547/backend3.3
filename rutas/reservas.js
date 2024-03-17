const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require('dotenv').config();
const router = express.Router();

// Crear una aplicación de express


// Usar el middleware de cors para permitir solicitudes de origen cruzado
router.use(cors());

// Usar el middleware de express para analizar el cuerpo de las solicitudes
router.use(express.json());

// Conectar a la base de datos de MongoDB con Mongoose
mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2');

// Crear un esquema de Mongoose para los datos de reserva
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  arrivalDate: Date,
  departureDate: Date,
  roomType: String,
  specialRequests: String,
  paymentMethod: String,
});

// Crear un modelo de Mongoose para los datos de reserva
const Booking = mongoose.model("Booking", bookingSchema);

// Crear un transportador de nodemailer para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Crear una ruta de API para manejar las solicitudes POST de reserva
router.post("/api/bookings", async (req, res) => {
  try {
    // Obtener los datos del formulario de la solicitud
    const {
      name,
      email,
      arrivalDate,
      departureDate,
      roomType,
      specialRequests,
      paymentMethod,
    } = req.body;

    // Validar los datos del formulario
    if (
      !name ||
      !email ||
      !arrivalDate ||
      !departureDate ||
      !roomType ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Crear un nuevo documento de reserva con los datos del formulario
    const booking = new Booking({
      name,
      email,
      arrivalDate,
      departureDate,
      roomType,
      specialRequests,
      paymentMethod,
    });

    // Guardar el documento de reserva en la base de datos
    await booking.save();

    // Crear un correo electrónico con los detalles de la reserva y los contactos para el pago
    const mailOptions = {
      from: "hotel@gmail.com",
      to: email,
      subject: "Confirmación de reserva de hotel",
      html: `<p>Hola ${name},</p>
      <p>Gracias por reservar con nosotros. Aquí están los detalles de tu reserva:</p>
      <ul>
        <li>Fecha de llegada: ${arrivalDate}</li>
        <li>Fecha de salida: ${departureDate}</li>
        <li>Tipo de habitación: ${roomType}</li>
        <li>Solicitudes especiales: ${specialRequests || "Ninguna"}</li>
        <li>Método de pago: ${paymentMethod}</li>
      </ul>
      <p>Para completar tu reserva, debes realizar el pago según el método elegido. Aquí están los contactos para el pago:</p>
      <ul>
      <li>Tarjeta de crédito: Llama al +58 212 555 5555 y proporciona el número de reserva ${booking._id}</li>
      <li>Paypal: Entra en www.paypal.com y envía el pago a hotel@paypal.com con el número de reserva ${booking._id} como nota</li>
      <li>Efectivo: Paga en el mostrador del hotel al llegar con el número de reserva ${booking._id}</li>
    </ul>
    <p>Si tienes alguna pregunta o necesitas cambiar o cancelar tu reserva, por favor contáctanos al +58 212 666 6666 o al hotel@email.com</p>
    <p>Esperamos verte pronto.</p>
    <p>Saludos,</p>
    <p>El equipo del hotel</p>`,
  };

  // Enviar el correo electrónico al usuario con los detalles de la reserva y los contactos para el pago
  await transporter.sendMail(mailOptions);

  // Crear un correo electrónico con una promoción especial para el usuario
  const promoMailOptions = {
    from: "hotel@gmail.com",
    to: email,
    subject: "Promoción especial para ti",
    html: `<p>Hola ${name},</p>
    <p>Como cliente apreciado, queremos ofrecerte una promoción especial para tu próxima reserva con nosotros. Si reservas antes del 31 de marzo de 2024, podrás disfrutar de un desayuno de bienvenida sin costo alguno en cualquier tipo de habitación.</p>
    <p>No dejes pasar esta oportunidad y reserva ya tu estancia con nosotros. Te esperamos con los brazos abiertos.</p>
    <p>Saludos,</p>
    <p>El equipo del hotel</p>`,
  };

  // Enviar el correo electrónico al usuario con la promoción especial
  await transporter.sendMail(promoMailOptions);

  // Enviar una respuesta exitosa al cliente con un mensaje de confirmación
  res.status(200).json({ message: "Reserva realizada con éxito" });
} catch (error) {
  // Si ocurre algún error, enviar una respuesta de error al cliente con un mensaje de error
  res.status(500).json({ message: error.message });
}
});


module.exports = router;
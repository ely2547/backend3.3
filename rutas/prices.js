const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2');

// Esquema de Mongoose para la habitación
const roomSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  price: Number,
  people: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number
  }]
});

const Room = mongoose.model('Room', roomSchema);

// CRUD Operations
// CREATE
router.post('/rooms', async (req, res) => {
  const room = new Room(req.body);
  try {
    await room.save();
    res.status(201).send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

// READ
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE
router.patch('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) {
      return res.status(404).send();
    }
    res.send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE
router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).send();
    }
    res.send(room);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Añadir reseña
router.post('/rooms/:id/reviews', async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).send({ message: 'Habitación no encontrada' });
      }
      await room.addReview(req.body);
      res.status(201).send(room);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  module.exports = router;

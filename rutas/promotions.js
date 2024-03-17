const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2');

// Esquema para las promociones
const promotionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  startDate: Date,
  endDate: Date
});

// Modelo basado en el esquema
const Promotion = mongoose.model('Promotion', promotionSchema);

// CRUD Operations
// CREATE
router.post('/promotions', async (req, res) => {
  const newPromotion = new Promotion(req.body);
  try {
    const savedPromotion = await newPromotion.save();
    res.status(201).send(savedPromotion);
  } catch (error) {
    res.status(400).send(error);
  }
});

// READ (all promotions)
router.get('/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.send(promotions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// READ (one promotion)
router.get('/promotions/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) res.status(404).send("No se encontró la promoción");
    res.send(promotion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE
router.put('/promotions/:id', async (req, res) => {
  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPromotion) res.status(404).send("No se encontró la promoción para actualizar");
    res.send(updatedPromotion);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE
router.delete('/promotions/:id', async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!deletedPromotion) res.status(404).send("No se encontró la promoción para eliminar");
    res.send(deletedPromotion);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

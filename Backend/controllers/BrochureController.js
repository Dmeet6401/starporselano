const db = require('../models/index');

const Brochure = db.Brochure;

const addBrochure = async (req, res) => {
    try {
        const { brochure_name, brochure_pdf, tile_size_id } = req.body;
        const brochure = await Brochure.create({ brochure_name, brochure_pdf, tile_size_id });
        res.status(201).json({ message: 'Brochure added successfully', brochure });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add brochure', error: error.message });
    }
}

const getAllBrochure = async (req, res) => {
    try {
        const brochure = await Brochure.findAll();
        res.status(200).json({ brochure });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get brochure', error: error.message });
    }
}

module.exports = {
    addBrochure,
    getAllBrochure
}
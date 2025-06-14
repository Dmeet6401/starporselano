const { Brochure } = require('../models');

const addBrochure = async (req, res) => {
    console.log(req.body)
    try {
        const { brochure_name, brochure_url, tile_size_id } = req.body;

        console.log(brochure_name, brochure_url, tile_size_id)

        if (!brochure_name || !brochure_url || !tile_size_id) {
            return res.status(400).json({
                message: 'Missing required fields: brochure_name, brochure_url, or tile_size_id'
            });
        }

        const brochure = await Brochure.create({
            brochure_name,
            brochure_url,
            tile_size_id
        });

        res.status(201).json({
            message: 'Brochure added successfully',
            brochure
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add brochure',
            error: error.message
        });
    }
}

const getAllBrochure = async (req, res) => {
    try {
        const brochures = await Brochure.find({ is_deleted: false }).populate('tile_size_id');
        res.status(200).json({ brochures });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get brochure', error: error.message });
    }
}

const deleteBrochure = async (req, res) => {
    try {
        const { brochure_id } = req.params;
        await Brochure.findByIdAndUpdate(brochure_id, { is_deleted: true });
        res.status(200).json({ message: 'Brochure deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete brochure', error: error.message });
    }
}

module.exports = {
    addBrochure,
    getAllBrochure,
    deleteBrochure
}
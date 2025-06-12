const db = require('../models/index');

const Sanitary = db.Sanitary_Ware;
const SanitaryType = db.Sanitary_Type;

const addSanitary = async (req, res) => {
    try {
        const { sanitary_ware_name, sanitary_ware_photo } = req.body;
        if (!sanitary_ware_name) {
            return res.status(400).json({ message: 'sanitary_ware_name is required' });
        }
        const sanitaryWare = await Sanitary.create({ sanitary_ware_name, sanitary_ware_photo });
        res.status(201).json({ message: 'Sanitary ware added successfully', sanitaryWare });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add sanitary', error: error.message });
    }
}

const getAllSanitary = async (req, res) => {
    try {
        const sanitaryWares = await Sanitary.findAll();
        res.status(200).json({ sanitaryWares });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sanitary', error: error.message });
    }
}

const addSanitaryType = async (req, res) => {
    try {
        const { sanitary_type_name } = req.body;
        const sanitaryType = await SanitaryType.create({ sanitary_type_name });
        res.status(201).json({ message: 'Sanitary type added successfully', sanitaryType });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add sanitary type', error: error.message });
    }
}

const getAllSanitaryType = async (req, res) => {
    try {
        const sanitaryTypes = await SanitaryType.findAll();
        res.status(200).json({ sanitaryTypes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sanitary type', error: error.message });
    }
}

const deleteSanitaryType = async (req, res) => {
    try {
        const { sanitary_type_id } = req.params;
        await SanitaryType.destroy({ where: { sanitary_type_id } });
        res.status(200).json({ message: 'Sanitary type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete sanitary type', error: error.message });
    }
}

const deleteSanitary = async (req, res) => {
    try {
        const { sanitary_id } = req.params;
        await Sanitary.destroy({ where: { sanitary_id } });
        res.status(200).json({ message: 'Sanitary item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete sanitary item', error: error.message });
    }
}

const editSanitaryType = async (req, res) => {
    try {
        const { sanitary_type_id } = req.params;
        const { sanitary_type_name } = req.body;
        
        if (!sanitary_type_name) {
            return res.status(400).json({ message: 'sanitary_type_name is required' });
        }
        
        const sanitaryType = await SanitaryType.findByPk(sanitary_type_id);
        if (!sanitaryType) {
            return res.status(404).json({ message: 'Sanitary type not found' });
        }

        await sanitaryType.update({ sanitary_type_name });
        res.status(200).json({ message: 'Sanitary type updated successfully', sanitaryType });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sanitary type', error: error.message });
    }
}

const editSanitary = async (req, res) => {
    try {
        const { sanitary_id } = req.params;
        const { sanitary_name, sanitary_type_id, description } = req.body;

        const sanitaryWare = await Sanitary.findByPk(sanitary_id);
        if (!sanitaryWare) {
            return res.status(404).json({ message: 'Sanitary item not found' });
        }

        // Handle image upload if present
        let imageUrl = sanitaryWare.sanitary_ware_photo;
        if (req.file) {
            // Implement your image upload logic here
            // imageUrl = await uploadImage(req.file);
        }

        await sanitaryWare.update({
            sanitary_ware_name: sanitary_name || sanitaryWare.sanitary_ware_name,
            sanitary_type_id: sanitary_type_id || sanitaryWare.sanitary_type_id,
            description: description || sanitaryWare.description,
            sanitary_ware_photo: imageUrl
        });

        res.status(200).json({ message: 'Sanitary item updated successfully', sanitaryWare });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sanitary item', error: error.message });
    }
}

module.exports = {
    addSanitary,
    getAllSanitary,
    addSanitaryType,
    getAllSanitaryType,
    deleteSanitaryType,
    deleteSanitary,
    editSanitaryType,
    editSanitary
}
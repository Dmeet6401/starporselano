const db = require('../models/index');

const Tile = db.Tile;
const TileType = db.TileType;
const TileSize = db.TileSize;


const addTileType = async (req, res) => {
    try {
        const { tile_type_name } = req.body;
        const tileType = await TileType.create({ tile_type_name });
        res.status(201).json({ message: 'Tile type added successfully', tileType });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add tile type', error: error.message });
    }
}

const getAllTileTypes = async (req, res) => {
    try {
        const tileTypes = await TileType.findAll();
        res.status(200).json({ tileTypes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tile types', error: error.message });
    }
}

const addTileSize = async (req, res) => {
    try {
        const { tile_size_name } = req.body;
        const tileSize = await TileSize.create({ tile_size_name });
        res.status(201).json({ message: 'Tile size added successfully', tileSize });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add tile size', error: error.message });
    }
}   

const getAllTileSizes = async (req, res) => {
    try {
        const tileSizes = await TileSize.findAll();
        res.status(200).json({ tileSizes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tile sizes', error: error.message });
    }
}

const addTile = async (req, res) => {
    try {
        const { tile_name, tile_type_id, tile_size_id, tile_photo } = req.body;

        const tile = await Tile.create({
            tile_name,
            tile_type_id,
            tile_size_id,
            description,
            tile_photo // This will be the ImageKit URL
        });

        res.status(201).json({ 
            message: 'Tile added successfully', 
            tile: {
                ...tile.toJSON(),
                image_url: tile.tile_photo // Add image_url for frontend consistency
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add tile', error: error.message });
    }
};

// const getTileByType = async (req, res) => {
//     try {
//         const { tile_type_id } = req.params;
//         const tile = await Tile.findAll({ where: { tile_type_id } });
//         res.status(200).json({ tile });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to get tile by type', error: error.message });
//     }
// }

// const getTileBySize = async (req, res) => {
//     try {
//         const { tile_size_id } = req.params;
//         const tile = await Tile.findAll({ where: { tile_size_id } });
//         res.status(200).json({ tile });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to get tile by size', error: error.message });
//     }
// }

// const getTilebyTypeAndSize = async (req, res) => {
//     try {
//         const { tile_type_id, tile_size_id } = req.params;
//         const tile = await Tile.findAll({ where: { tile_type_id, tile_size_id } });
//         res.status(200).json({ tile });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to get tile by type and size', error: error.message });
//     }
// }

const getTiles = async (req, res) => {
    try {
        const { tile_type_id, tile_size_id } = req.params;

        // Build dynamic where clause based on available parameters
        const whereClause = {};
        if (tile_type_id) whereClause.tile_type_id = tile_type_id;
        if (tile_size_id) whereClause.tile_size_id = tile_size_id;

        const tiles = await Tile.findAll({ where: whereClause });

        res.status(200).json({ tiles });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tiles', error: error.message });
    }
}

const deleteTileType = async (req, res) => {
    try {
        const { tile_type_id } = req.params;
        await TileType.destroy({ where: { tile_type_id } });
        res.status(200).json({ message: 'Tile type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tile type', error: error.message });
    }
}

const deleteTileSize = async (req, res) => {
    try {
        const { tile_size_id } = req.params;
        await TileSize.destroy({ where: { tile_size_id } });
        res.status(200).json({ message: 'Tile size deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tile size', error: error.message });
    }
}

const deleteTile = async (req, res) => {
    try {
        const { tile_id } = req.params;
        await Tile.destroy({ where: { tile_id } });
        res.status(200).json({ message: 'Tile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tile', error: error.message });
    }
};

const editTileType = async (req, res) => {
    try {
        const { tile_type_id } = req.params;
        const { tile_type_name } = req.body;
        
        if (!tile_type_name) {
            return res.status(400).json({ message: 'tile_type_name is required' });
        }

        const tileType = await TileType.findByPk(tile_type_id);
        if (!tileType) {
            return res.status(404).json({ message: 'Tile type not found' });
        }

        await tileType.update({ tile_type_name });
        res.status(200).json({ message: 'Tile type updated successfully', tileType });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update tile type', error: error.message });
    }
};

const editTileSize = async (req, res) => {
    try {
        const { tile_size_id } = req.params;
        const { tile_size } = req.body;
        
        if (!tile_size) {
            return res.status(400).json({ message: 'tile_size is required' });
        }

        const tileSize = await TileSize.findByPk(tile_size_id);
        if (!tileSize) {
            return res.status(404).json({ message: 'Tile size not found' });
        }

        // Update both tile_size and tile_size_name with the same value
        await tileSize.update({ 
            tile_size: tile_size,
            tile_size_name: tile_size // Use the same value for both fields
        });

        // Fetch the updated record to ensure we have the latest data
        const updatedTileSize = await TileSize.findByPk(tile_size_id);
        
        res.status(200).json({ 
            message: 'Tile size updated successfully', 
            tileSize: updatedTileSize 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update tile size', error: error.message });
    }
};

const editTile = async (req, res) => {
    try {
        const { tile_id } = req.params;
        const { tile_name, tile_type_id, tile_size_id, tile_photo } = req.body;

        const tile = await Tile.findByPk(tile_id);
        if (!tile) {
            return res.status(404).json({ message: 'Tile not found' });
        }

        await tile.update({
            tile_name: tile_name || tile.tile_name,
            tile_type_id: tile_type_id || tile.tile_type_id,
            tile_size_id: tile_size_id || tile.tile_size_id,
            // description: description || tile.description,
            tile_photo: tile_photo || tile.tile_photo // Update image URL if provided
        });

        // Fetch the updated record to ensure we have the latest data
        const updatedTile = await Tile.findByPk(tile_id);
        
        res.status(200).json({ 
            message: 'Tile updated successfully', 
            tile: {
                ...updatedTile.toJSON(),
                image_url: updatedTile.tile_photo // Add image_url for frontend consistency
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update tile', error: error.message });
    }
};

module.exports = {
    addTileType,
    getAllTileTypes,
    addTileSize,
    getAllTileSizes,
    addTile,
    getTiles,
    deleteTileType,
    deleteTileSize,
    deleteTile,
    editTileType,
    editTileSize,
    editTile
};
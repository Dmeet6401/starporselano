const { Tile, TileType, TileSize } = require('../models');

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
        const tileTypes = await TileType.find({ is_deleted: false });
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
        const tileSizes = await TileSize.find({ is_deleted: false });
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
            tile_photo
        });

        res.status(201).json({ 
            message: 'Tile added successfully', 
            tile: {
                ...tile.toObject(),
                image_url: tile.tile_photo
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

        // Build query based on available parameters
        const query = { is_deleted: false };
        if (tile_type_id) query.tile_type_id = tile_type_id;
        if (tile_size_id) query.tile_size_id = tile_size_id;

        const tiles = await Tile.find(query)
            .populate('tile_type_id')
            .populate('tile_size_id');

        res.status(200).json({ tiles });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tiles', error: error.message });
    }
}

const deleteTileType = async (req, res) => {
    try {
        const { tile_type_id } = req.params;
        await TileType.findByIdAndUpdate(tile_type_id, { is_deleted: true });
        res.status(200).json({ message: 'Tile type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tile type', error: error.message });
    }
}

const deleteTileSize = async (req, res) => {
    try {
        const { tile_size_id } = req.params;
        await TileSize.findByIdAndUpdate(tile_size_id, { is_deleted: true });
        res.status(200).json({ message: 'Tile size deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tile size', error: error.message });
    }
}

const deleteTile = async (req, res) => {
    try {
        const { tile_id } = req.params;
        await Tile.findByIdAndUpdate(tile_id, { is_deleted: true });
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

        const tileType = await TileType.findOneAndUpdate(
            { _id: tile_type_id, is_deleted: false },
            { tile_type_name },
            { new: true }
        );

        if (!tileType) {
            return res.status(404).json({ message: 'Tile type not found' });
        }

        res.status(200).json({ message: 'Tile type updated successfully', tileType });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update tile type', error: error.message });
    }
};

const editTileSize = async (req, res) => {
    try {
        const { tile_size_id } = req.params;
        const { tile_size_name } = req.body;
        
        if (!tile_size_name) {
            return res.status(400).json({ message: 'tile_size_name is required' });
        }

        const tileSize = await TileSize.findOneAndUpdate(
            { _id: tile_size_id, is_deleted: false },
            { tile_size_name },
            { new: true }
        );

        if (!tileSize) {
            return res.status(404).json({ message: 'Tile size not found' });
        }

        res.status(200).json({ 
            message: 'Tile size updated successfully', 
            tileSize 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update tile size', error: error.message });
    }
};

const getSizeByTileType = async (req, res) => {
    try {
        const { tile_type_id } = req.params;
        const tileSizes = await TileSize.find({ tile_type_id });
        res.status(200).json({ tileSizes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get tile sizes by type', error: error.message });
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
    getSizeByTileType
};
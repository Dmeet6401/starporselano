const tileController = require('../controllers/TileController');

const express = require('express');

const router = express.Router();

router.post('/add-tile-type', tileController.addTileType);
router.post('/add-tile-size', tileController.addTileSize);
router.post('/add-tile', tileController.addTile);

// router.get('/get-tile-by-type', tileController.getTileByType);
// router.get('/get-tile-by-size', tileController.getTileBySize);
// router.get('/get-tile', tileController.getTiles);
router.get('/get-all-tiles', tileController.getTiles);
router.get('/get-all-tile-types', tileController.getAllTileTypes);
router.get('/get-all-tile-sizes', tileController.getAllTileSizes);

router.get('/tiles/:tile_type_id', tileController.getTiles); 
router.get('/tiles/:tile_type_id/:tile_size_id', tileController.getTiles); 

// Edit routes using PUT
router.put('/edit-tile-type/:tile_type_id', tileController.editTileType);
router.put('/edit-tile-size/:tile_size_id', tileController.editTileSize);
router.put('/edit-tile/:tile_id', tileController.editTile);

router.delete('/delete-tile-type/:tile_type_id', tileController.deleteTileType);
router.delete('/delete-tile-size/:tile_size_id', tileController.deleteTileSize);
router.delete('/delete-tile/:tile_id', tileController.deleteTile);

module.exports = router;
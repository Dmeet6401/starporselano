const express = require("express");
const { addBrochure, getAllBrochure } = require("../controllers/BrochureController");

const router = express.Router();

router.post("/add-brochure", addBrochure);
router.get("/get-all-brochures", getAllBrochure);

module.exports = router;
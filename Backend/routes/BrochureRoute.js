const express = require("express");
const { addBrochure, getAllBrochure, deleteBrochure } = require("../controllers/BrochureController");

const router = express.Router();

router.post("/add-brochure", addBrochure);
router.get("/get-all-brochures", getAllBrochure);
router.delete("/delete-brochure/:id", deleteBrochure);

module.exports = router;
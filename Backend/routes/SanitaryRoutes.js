const sanitaryController = require("../controllers/SanitaryController");

const express = require("express");

const router = express.Router();

router.post("/add-sanitary-type", sanitaryController.addSanitaryType);
router.post("/add-sanitary", sanitaryController.addSanitary);
router.get("/get-sanitary-type", sanitaryController.getAllSanitaryType);
router.get("/get-sanitary", sanitaryController.getAllSanitary);

// Edit routes using PUT
router.put("/edit-sanitary-type/:sanitary_type_id", sanitaryController.editSanitaryType);
router.put("/edit-sanitary/:sanitary_id", sanitaryController.editSanitary);

// Delete routes
router.delete("/delete-sanitary-type/:sanitary_type_id", sanitaryController.deleteSanitaryType);
router.delete("/delete-sanitary/:sanitary_id", sanitaryController.deleteSanitary);

module.exports = router;
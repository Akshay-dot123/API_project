const express = require("express");
const router = express.Router();
const registerController = require("../controller/register-controller");
router.get("/", registerController.getRegister);
router.get("/pdf",)
router.post("/create", registerController.postRegister);
router.delete("/delete", registerController.deleteRegister);
router.put("/update",registerController.updateRegsiter);
module.exports = router;

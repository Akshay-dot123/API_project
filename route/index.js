require("dotenv").config();
const express = require("express");
const registrationRoute = require("./registration.route");
const registerController = require("../controller/register-controller");
const generatePDF = require("../controller/pdf-controller");
const bulkImportData = require("../controller/excel-controller");
// const backupDB = require("../controller/system-backup-controller");
const EmailSender = require("../controller/nodemailer-controller");
const exportToExcel = require("../controller/excel-export-controller");
const pageParams=require("../controller/pagination-params-controller")
const { verifyToken } = require("../middleware/jwt-auth");
const router = express.Router();
router.get("/params",pageParams)
// router.get("/backup", backupDB);
router.get("/nodemailer", EmailSender);
router.get("/pdf", generatePDF);
router.get("/excel", bulkImportData);
router.get("/excel-export", exportToExcel);
router.get("/login", registerController.getLogin);
router.use("/", registrationRoute);
router.post("/user", registerController.postUser);
router.use(verifyToken);
router.post("/logout", registerController.postLogout);
module.exports = router;

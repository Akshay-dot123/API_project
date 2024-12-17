const ExcelJS = require("exceljs");
const models = require("../models");
async function exportToExcel(req, res) {
  try {
    // Fetch all data from the dummies table
    const dummiesData = await models.dummy.findAll({
      // attributes: ['first_name', 'last_name']
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dummies Data");

    // Add column headers
    worksheet.columns = [
      { header: "First Name", key: "first_name", width: 20 },
      { header: "Last Name", key: "last_name", width: 20 },
      { header: "Phone Number", key: "phone_number", width: 20 },
    ];

    // Adds data in rows
    dummiesData.forEach((dummy) => {
      worksheet.addRow({
        first_name: dummy.first_name,
        last_name: dummy.last_name,
        phone_number: dummy.phone_number,
      });
    });

    // Save the Excel file
    const filePath = "dummies_data.xlsx";
    await workbook.xlsx.writeFile(filePath);
    // await workbook.csv.writeFile("dummies_data.csv");
    // await workbook.xlsx.writeFile("dummies_data.xlsx");
    console.log("Data exported successfully to dummies_data.xlsx");
    return filePath;
    res.status(200).send("Data Inserted");
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

// Call the function to export the data
module.exports = exportToExcel;

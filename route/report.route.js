const express = require("express");
const path = require("path");
const generatePDF = require("../controller/pdf-controller");
const app = express();
const fs=require("fs")
const registerController=require("../controller/register-controller")
const port = 3000;

// Sample dynamic data
// const data = {
//   title: "Dynamic PDF Report",
//   users: [
//     { name: "John Doe", age: 30 },
//     { name: "Jane Smith", age: 25 },
//     { name: "Michael Brown", age: 40 },
//   ],
// };

// Route to generate PDF
app.get("/", async (req, res) => {
  try {
    const registers = await registerController.getRegister();
    const data = {
      title: 'Dynamic PDF Report',
      users: registers.map(register => ({ name: register.name, age: register.age }))
    };
    console.log(data);
    
    // generatePDF(data)
    //   .then((pdfBuffer) => {
    //     fs.writeFileSync("output.pdf", pdfBuffer);
    //     console.log("PDF generated and saved as output.pdf");
    //     res.status(200).json({ message: "PDF generated successfully", filename: "output.pdf" });
    //   })
    //   .catch((error) => {
    //     console.error("Error generating PDF:", error);
    //     res.status(500).send("Error generating PDF");
    //   });
      
    // Waste code
    // const pdfBuffer = await pdfController.generatePDF(data);
    // console.log(pdfBuffer);
    // try {
    //   const pdfBuffer = await page.pdf({ format: 'A4' });
    //   console.log("PDF generated successfully.");
    // } catch (err) {
    //   console.error("Error generating PDF:", err);
    // }

    // Set the response headers to serve the PDF file
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   'attachment; filename="dynamic-report.pdf"'
    // );

    // // Send the generated PDF to the client
    // res.send(pdfBuffer);
  } catch (error) {
  //   console.error("Error generating PDF:", error);
  //   res.status(500).send("Error generating PDF");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

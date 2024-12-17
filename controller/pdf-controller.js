const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const models = require("../models");

handlebars.registerHelper("formatDate", function (date_of_birth) {
  if (date_of_birth) {
    const date = new Date(date_of_birth);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-IN", options);
  }
  return "";
});

async function generatePDF(data1, data) {
  const combinedData = {
    title: data1.title,
    static_user: data1.static_user,
    users: [...data.users],
  };

  console.log("Combined Data:", JSON.stringify(combinedData, null, 2));
  // async function generatePDF(combinedData) {
  const templatePath = path.join(__dirname, "../views/dynamicTemplate.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const htmlContent = template(combinedData);
  // console.log("HTML Content========>", htmlContent);

  // Launch Puppeteer to generate the PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // console.log("HTML page========>",page);
  await page.setContent(htmlContent);

  // Generate the PDF and return as a buffer
  const pdfBuffer = await page.pdf({ printBackground: true, format: "A4" });
  // console.log("pdfBuffer========>",pdfBuffer);
  await browser.close();
  return pdfBuffer;
}
// // Sample dynamic data
// const data1 = {
//   title: "Dynamic PDF Report",
//   users: [
//     { name: "John Doe", age: 30 },
//     { name: "Jane Smith", age: 25 },
//     { name: "Michael Brown", age: 40 },
//   ],
// };

const data1 = {
  static_user: [
    {
      Title: "Users Data",
      First_name: "John",
      Last_name: "Doe",
      age: 46,
      address: "New York Times square, NY, USA",
    },
  ],
};

async function a() {
  try {
    // return await models.User.findAll();
    return await models.User.findAll({
      include: [
        {
          model: models.Register,
          attributes: ["email", "password"],
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching registers:", error);
    throw error;
  }
}
// console.log(a());

// Normal code to extract only user table
// async function generate() {
//   try {
//     let registers = await a();
//     console.log("After all data", registers[0].dataValues); // Logs after data is fetched
//     const data = {
//       title: "User Details",
//       users: registers.map(user => user.dataValues)  // Map the Sequelize model instances to plain data
//     };
//     console.log(data);

// Code to extract user table along with email which is in register table
async function generate() {
  try {
    let registers = await a();
    // console.log("After all data", registers[0].dataValues);
    const data = {
      title: "User Details",
      users: registers.map((user) => ({
        ...user.dataValues,
        registerEmail: user.Register.email,
      })),
    };
    console.log("Combined Data:", { ...data1, ...data });
    generatePDF(data1, data).then((pdfBuffer) => {
      let a = fs.writeFileSync("output.pdf", pdfBuffer);
      console.log("PDF generated and saved as output.pdf");
      return a;
    });
    // Below 2 lines of code is only for nodemailer
    const pdfBuffer = await generatePDF(data1, data);
    return pdfBuffer;
  } catch (error) {
    console.error("Error in generating PDF:", error);
  }
}
// generate();

//old code

// let registers;
// async function a() {
//   try {
//     registers = await models.User.findAll();
//     console.log(registers);
//     // res.status(201).json(registers);
//   } catch (error) {
//     console.error("Error fetching registers:", error);
//   }
// }
// a();
// console.log("AFter all data", registers);

// // const data = {
// //   title: "Dynamic PDF Report",
// //   users: register.map((register) => ({
// //     name: register.name,
// //     age: register.age,
// //   })),
// // };
// // console.log(data);

// generatePDF(registers).then((pdfBuffer) => {
//   fs.writeFileSync("output.pdf", pdfBuffer);
//   console.log("PDF generated and saved as output.pdf");
//   //   res
//   //     .status(200)
//   //     .json({ message: "PDF generated successfully", filename: "output.pdf" });
// });

module.exports = generate;

const fs = require("fs");
const csv = require("csv-parser");
const models = require("../models");
const path = require("path");
const xlsx = require("xlsx");
const dummySchema = require("../middleware/validation/dummyValidation");
const validateInput = require("../util/util");
const { sequelize } = require("../models");

// Normal function to import data
// async function importData() {
//   //   const users = [];
//   fs.createReadStream(path.join(__dirname, "../excel/Dummy_Data.csv"))
//     .pipe(csv())
//     .on("data", async (row) => {
//       // Extract data from the CSV row
//       // const { email, date_of_birth, age, gender, registerId } = row;
//       // if (!email || !date_of_birth || !age || !gender || !registerId) {
//       //   console.error("Missing required fields in row:", row);
//       //   return;
//       // }
//       const { first_name, phone_number } = row;
//       // console.log("row Data===============>",row);

//       const validationError = validateInput(row, dummySchema);
//       if (validationError) {
//         return console.log("Error dude..................",row,validationError);
//         // return res.status(400).send(validationError);
//       }
//       if (!first_name || !phone_number) {
//         console.error("Missing required fields in row:", row);
//         return;
//       }
//       console.log("============");

//       // console.log(first_name);
//       console.log("============111111111111");
//       // Step 1: Insert the email into the Register table
//       //   const register = await models.Register.create({ email: Email });

//       try {
//         // let a = await models.User.create({
//         //   date_of_birth,
//         //   age,
//         //   gender,
//         //   registerId,
//         // });
//         let a = await models.dummy.create({
//           first_name,
//           phone_number,
//         });
//         console.log("Users data if no error ===========>", a);
//       } catch (error) {
//         console.log("****** Error Message starts here ******");
//         if (error.name === "SequelizeUniqueConstraintError") {
//           console.error(
//             "SQL Error Message:==========>",
//             error.parent.sqlMessage
//           );
//         } else if (error.parent && error.parent.sqlMessage) {
//           console.error(
//             "SQL Error Message:=========>",
//             error.parent.sqlMessage,
//             " for below parameters in excel sheet => "
//           );
//           if (error.parameters) {
//             console.error("SQL Parameters:", error.parameters);
//           }
//         } else {
//           console.error(`Error fetching registers:========> ${error} `);
//         }
//       }
//     })
//     .on("end", () => {
//       console.log("CSV import finished!");
//     })
//     .on("error", (error) => {
//       console.error("Error reading CSV file:", error);
//     });
// }

// Works only for CSV file
// async function bulkImportData(filePath, chunkSize) {
//   const parser = fs
//     .createReadStream(filePath)
//     .pipe(csv({ columns: true, delimiter: "," }));
//   let chunk = [];
//   let count = 0;
//   for await (const row of parser) {
//     const { first_name, phone_number } = row;
//     // same code for both from here
//     const validationError = validateInput(row, dummySchema);
//     if (validationError) {
//       console.log("Validation error for row:", row, validationError);
//       throw new Error("Invalid data");
//     }
//     chunk.push({ first_name, phone_number });
//     count++;
//     if (count % chunkSize === 0) {
//       await processChunk(chunk);
//       chunk = [];
//     }
//   }
//   if (chunk.length > 0) {
//     await processChunk(chunk);
//   }
//   console.log("Finished reading CSV file.");
// }
// bulkImportData("./excel/Dummy_Data.csv", 10).catch((err) =>
//   console.error("Error reading CSV file:", err)
// );

// All 3 file formats are supported for this code XLSX, XLS, CSV file but not correct
// async function bulkImportData(filePath, chunkSize) {
//   const workbook = xlsx.readFile(filePath);
//   // console.log("workbook=========>", workbook);
//   const sheetName = workbook.SheetNames[0]; //Getting the First Sheet Name
//   // console.log("sheetName=========>", sheetName);
//   const worksheet = workbook.Sheets[sheetName]; //Getting the Worksheet Data
//   // console.log("worksheet=======>", worksheet);

//   // Convert the sheet to JSON format where header:1 is key for JSON objects
//   const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//   const headers = rows[0]; // Contains column names of excel data
//   console.log("headers=======>", headers);
//   let chunk = [];
//   let count = 0;
//   for (let i = 1; i < rows.length; i++) {
//     const row = rows[i];
//     // const [first_name, phone_number] = row;
//     // const rowData = { first_name, phone_number };

//     // New lines of code from here
//     const rowData = {};
//     headers.forEach((header, index) => {
//       rowData[header] = row[index];
//     });
//     const { first_name, last_name, phone_number } = rowData;
//     // to here

//     // same code for both from here
//     const validationError = validateInput(rowData, dummySchema);
//     if (validationError) {
//       console.log("Validation error for row:", rowData, validationError);
//       throw new Error("Invalid data");
//     }
//     chunk.push({ first_name, last_name, phone_number });
//     count++;
//     if (count % chunkSize === 0) {
//       await processChunk(chunk);
//       chunk = [];
//     }
//   }
//   if (chunk.length > 0) {
//     await processChunk(chunk);
//   }
//   console.log("Finished reading XLSX file.");
// }

// async function processChunk(chunk) {
//   const transaction = await sequelize.transaction();
//   try {
//     await models.dummy.bulkCreate(chunk, { transaction });
//     console.log(`Successfully processed chunk of size: ${chunk.length}`);
//     await transaction.commit();
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error processing chunk:", error);
//     throw error;
//   }
// }
// async function handleBulkImport(req, res) {
//   try {
//     await bulkImportData("./excel/Dummy_Data.csv", 10);
//     res.status(200).json("Data inserted into Database");
//   } catch (err) {
//     console.error("Error reading XLSX, XLS or CSV file:", err);
//     res.status(500).json({
//       message: "Error processing XLSX, XLS or CSV file",
//       error: err.message,
//     });
//   }
// }

// Perfectly correct code
async function bulkImportData(filePath, chunkSize) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Getting the First Sheet Name
  const worksheet = workbook.Sheets[sheetName]; // Getting the Worksheet Data

  // Convert the sheet to JSON format where header:1 is key for JSON objects
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const headers = rows[0]; // Contains column names of excel data
  console.log("headers=======>", headers);
  let chunk = [];
  let count = 0;

  // Start a single transaction that will encompass all chunks
  const transaction = await sequelize.transaction();

  try {
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Convert row data to an object using headers
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });

      const { first_name, last_name, phone_number } = rowData;

      // Validate the row data
      const validationError = validateInput(rowData, dummySchema);
      if (validationError) {
        console.log("Validation error for row:", rowData, validationError);
        throw new Error("Invalid data");
      }
      chunk.push({ first_name, last_name, phone_number });
      count++;

      if (count % chunkSize === 0) {
        await processChunk(chunk, transaction); // Pass the transaction to each chunk
        chunk = []; // Reset chunk after processing
      }
    }

    // Process any remaining rows after the loop ends
    if (chunk.length > 0) {
      await processChunk(chunk, transaction);
    }
    // If everything is successful, commit the transaction
    await transaction.commit();
    console.log("Finished reading and inserting XLSX data.");
  } catch (err) {
    // If there's an error, rollback the entire transaction (including all previous chunks)
    await transaction.rollback();
    console.error("Error processing data:", err);
    throw err;
  }
}

async function processChunk(chunk, transaction) {
  try {
    // Insert data for the chunk within the provided transaction
    await models.dummy.bulkCreate(chunk, { transaction });
    console.log(`Successfully processed chunk of size: ${chunk.length}`);
  } catch (error) {
    console.error("Error processing chunk:", error);
    throw error;
  }
}

async function handleBulkImport(req, res) {
  try {
    await bulkImportData("./excel/RandomData.xlsx", 10);
    res.status(200).json("Data inserted into Database");
  } catch (err) {
    console.error("Error reading XLSX, XLS or CSV file:", err);
    res.status(500).json({
      message: "Error processing XLSX, XLS or CSV file",
      error: err.message,
    });
  }
}

module.exports = handleBulkImport;
// module.exports = importData;

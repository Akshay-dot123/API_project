const fs = require("fs");
const models = require("../models");
const cron = require("node-cron");
const { sequelize } = require("../models");
const path=require("path")

// Backup in the form of json
async function fetchDataAndSave(req, res) {
    try {
        const dataToSave = {};
      // Iterate over all models
      for (const modelName in models) {
        if (models[modelName].findAll) {
          // Check if the model has a findAll method
          const records = await models[modelName].findAll();
          dataToSave[modelName] = records; // Store records with model name as key
        }
      }
      // Convert data to JSON format
      const jsonData = JSON.stringify(dataToSave, null, 2); // Pretty print with 2 spaces
      fs.writeFileSync("data.json", jsonData);
      console.log("Data saved to data.json");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}
cron.schedule("* * * * *", fetchDataAndSave);

async function fetchAllDataAndSave(req, res) {
    await fetchDataAndSave();
    res.status(200).send("Data saved as backup successfully");
}


// In SQL format
// async function fetchAllDataAndSave(req, res) {
//     try {
//         let sqlStatements = [];
//         // Iterate over all models
//         for (const modelName in models) {
//             if (models[modelName].findAll) {
//                 // Check if the model has a findAll method
//                 const records = await models[modelName].findAll();
//                 // Generate SQL insert statements for each record
//                 records.forEach(record => {
//                     const values = Object.values(record.dataValues).map(value => 
//                         typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value
//                     );
//                     const sql = `INSERT INTO ${modelName} (${Object.keys(record.dataValues).join(', ')}) VALUES (${values.join(', ')});\n`;
//                     sqlStatements.push(sql);
//                 });
//             }
//         }

//         // Write all SQL statements to a file
//         fs.writeFileSync("data.sql", sqlStatements.join(''));
//         console.log("Data saved to data.sql");
//         res.status(200).send("Data saved as backup successfully");
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).send("Error fetching data");
//     }
// }

module.exports = fetchAllDataAndSave;

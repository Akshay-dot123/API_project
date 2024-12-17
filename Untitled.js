const { Customer, User } = require("../models"); // Import your RoleMenu model
const xlsx = require("xlsx");
const csv = require("csv-parser");
const { Readable } = require("stream");
const AppError = require("../utils/appError");
const dayjs = require("dayjs");

async function getExecutiveCustomer(req, res, next) {
  try {
    const userId = req.userId;
    const result = await Customer.findAll({
      where: { executiveUserId: userId },
    });
    res.status(200).json(result);
  } catch (error) {
    next(AppError.internal());
  }
}

async function getAllCustomers(req, res, next) {
  try {
    const userId = req.userId;
    const roleId = req.roleId;
    const roleName = req.roleName;

    const page = parseInt(req.body.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.body.limit) || 15; // Default to 15 items per page if not provided
    const offset = (page - 1) * limit;

    const grdFilter = req.body.gridFilters;
    let customers = {};
    let total;

    let filter = {};

    if (grdFilter) {
      // Convert gridFilters string to object
      filter = {
        ...filter,
        [Op.and]: Object.keys(grdFilter).map((key) => ({
          [key]: {
            [Op.like]: `%${grdFilter[key]}%`,
          },
        })),
      };
    }

    if (roleName == "Admin") {
      const { count, rows } = await Customer.findAndCountAll({
        where: filter,
        include: [
          {
            model: models.User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        limit: limit,
        offset: offset,
      });
      customers = rows;
      total = count;
    } else if (roleName == "Team Lead") {
      const user = await User.findAndCountAll({
        where: {
          teamLeadId: userId,
        },
        attributes: ["id"],
        raw: true,
      });
      const executiveIds = [];

      for await (item of user.rows) {
        executiveIds.push(item.id);
      }

      const { count, rows } = await Customer.findAndCountAll({
        where: {
          ...filter,
          executiveUserId: {
            [Op.in]: executiveIds,
          },
        },
        include: [
          {
            model: models.User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        limit: limit,
        offset: offset,
      });
      customers = rows;
      total = count;
    } else {
      return res
        .status(400)
        .json({ error: "User does not have permission to fetch customer" });
    }
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: customers,
      pagination: {
        totalItems: total,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(AppError.internal());
  }
}

async function getCustomerById(req, res, next) {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(AppError.internal());
  }
}

async function createCustomer(req, res, next) {
  try {
    const {
      accountNumber,
      mobileNumber,
      customerName,
      subProductName,
      loanAmount,
      emiAmount,
      totalOverdueAmount,
      currentPos,
      product,
      productType,
      branch,
      bomBucket,
      bomDpd,
      communicationAddress,
      executiveEmployeeCode,
      executiveUserId,
      expireDate,
    } = req.body;

    const newCustomer = await Customer.create({
      accountNumber,
      mobileNumber,
      customerName,
      subProductName,
      loanAmount,
      emiAmount,
      totalOverdueAmount,
      currentPos,
      product,
      productType,
      branch,
      bomBucket,
      bomDpd,
      communicationAddress,
      executiveEmployeeCode,
      executiveUserId,
      expireDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json(newCustomer);
  } catch (error) {
    next(AppError.internal());
  }
}

async function updateCustomer(req, res, next) {
  const { id } = req.params;
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(id);
      return res.status(200).json(updatedCustomer);
    }
    throw new Error("Customer not found");
  } catch (error) {
    next(AppError.internal());
    return;
  }
}

const importExcelAllFormat = async (req, res, next) => {
  const transaction = await models.sequelize.transaction();
  try {
    if (!req.file) {
      console.error("Error: No file uploaded");
      return next(AppError.badRequest({ error: "Please upload a file" }));
    }

    const fileType = req.file.originalname.split(".").pop().toLowerCase();

    if (fileType === "xlsx" || fileType === "xls") {
      try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        const mappedData = await mapData(jsonData);

        await bulkInsertInChunks(mappedData, models.Customer, transaction);
        await transaction.commit();
        return res.status(200).send({
          message: "Data imported successfully",
        });
      } catch (err) {
        await transaction.rollback();
        console.error(
          `Error processing Excel file: ${err.message}\nStack: ${err.stack}`
        );
        return next(AppError.badRequest({ error: err.message }));
      }
    } else if (fileType === "csv") {
      try {
        const csvData = [];
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        bufferStream
          .pipe(csv())
          .on("data", (row) => csvData.push(row))
          .on("end", async () => {
            try {
              const mappedData = await mapData(csvData);
              await bulkInsertInChunks(
                mappedData,
                models.Customer,
                transaction
              );
              await transaction.commit();
              return res.status(200).send({
                message: "Data imported successfully",
              });
            } catch (err) {
              await transaction.rollback();
              console.error(
                `Error processing CSV data: ${err.message}\nStack: ${err.stack}`
              );
              return next(
                AppError.badRequest({
                  error: `${err.message}`,
                })
              );
            }
          })
          .on("error", async (err) => {
            await transaction.rollback();
            console.error(
              `Error reading CSV file: ${err.message}\nStack: ${err.stack}`
            );
            return next(
              AppError.badRequest(
                AppError.badRequest({
                  error: `${err.message}`,
                })
              )
            );
          });
      } catch (err) {
        await transaction.rollback();
        console.error(
          `Error processing CSV file: ${err.message}\nStack: ${err.stack}`
        );
        return next(
          AppError.badRequest({
            error: `${err.message}`,
          })
        );
      }
    } else {
      await transaction.rollback();
      console.error("Error: Unsupported file format");
      return next(AppError.badRequest({ error: "Unsupported file format" }));
    }
  } catch (error) {
    await transaction.rollback();
    console.error(
      `Error importing data: ${error.message}\nStack: ${error.stack}`
    );
    return next(
      AppError.internal({
        error: `${err.message}`,
      })
    );
  }
};

const CHUNK_SIZE = 4000;
const getColumnName = (row, errorMessage) => {
  const regex = /Field '(.+)' is missing or null/;
  const match = errorMessage.match(regex);
  return match ? match[1] : "Unknown column";
};

const mapRowFields = async (row, employeeCode) => {
  return {
    accountNumber: await processField(row, "ACCOUNT NUMBER", "accountNumber"),
    mobileNumber: await processField(row, "MOBILE NUMBER", "mobileNumber"),
    customerName: await processField(row, "CUSTOMER NAME", "customerName"),
    subProductName: await processField(
      row,
      "SUB PRODUCT NAME",
      "subProductName"
    ),
    loanAmount: await processField(row, "LOAN AMOUNT", "loanAmount"),
    emiAmount: await processField(row, "EMI AMOUNT", "emiAmount"),
    totalOverdueAmount: await processField(
      row,
      "TOTAL OVERDUE AMOUNT",
      "totalOverdueAmount"
    ),
    currentPos: await processField(row, "CURRENT POS", "currentPos"),
    product: await processField(row, "PRODUCT", "product"),
    productType: await processField(row, "PRODUCT TYPE", "productType"),
    branch: await processField(row, "BRANCH", "branch"),
    bomBucket: await processField(row, "BOM BUCKET", "bomBucket"),
    bomDpd: await processField(row, "BOM DPD", "bomDpd"),
    communicationAddress: await processField(
      row,
      "COMMUNICATION ADDRESS",
      "communicationAddress"
    ),
    executiveEmployeeCode: await processField(
      row,
      "EXECUTIVE EMPLOYEE CODE",
      "executiveEmployeeCode"
    ),
    executiveNumber: await processField(
      row,
      "EXECUTIVE NUMBER",
      "executiveNumber"
    ),
    executiveUserId: await processField(
      row,
      "EXECUTIVE EMPLOYEE CODE",
      "executiveUserId",
      employeeCode
    ),
  };
};

const processField = async (row, field, fieldName, processor) => {
  if (!(field in row)) {
    throw new Error(`Field '${field}' is missing or null`);
  }
  try {
    return processor ? await processor(row[field]) : row[field];
  } catch (error) {
    throw new Error(`Error processing column '${field}': ${error.message}`);
  }
};

const formatDate = async (inputDate) => {
  let formattedDate;
  if (typeof inputDate === "number") {
    const excelEpoch = dayjs("1900-01-01");
    const daysSinceEpoch = inputDate - 1;
    const date = excelEpoch.add(daysSinceEpoch - 1, "day");
    formattedDate = date.format("YYYY-MM-DD");
  } else if (typeof inputDate === "string") {
    formattedDate = dayjs(inputDate).format("YYYY-MM-DD");
  }
  return formattedDate;
};

const mapData = async (data) => {
  const mappedData = [];
  for await (const [rowIndex, row] of data.entries()) {
    try {
      const mappedRow = await mapRowFields(row, employeeCode);
      mappedRow.expireDate = await processField(
        row,
        "EXPIRE DATE",
        "expireDate",
        formatDate
      );

      mappedData.push(mappedRow);
    } catch (error) {
      const columnName = getColumnName(row, error.message);
      throw new Error(
        `Error processing row ${rowIndex + 1}, column ${columnName}: ${
          error.message
        }`
      );
    }
  }
  return mappedData;
};

const bulkInsertInChunks = async (data, model, transaction) => {
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    try {
      await model.bulkCreate(chunk, { transaction });
    } catch (error) {
      console.error("Error inserting chunk:", error);
      throw new Error("Error inserting data: " + error.message);
    }
  }
};

const employeeCode = async (empCode) => {
  try {
    const executive = await models.User.findOne({
      where: {
        employeeCode: empCode.trim(),
      },
      attributes: ["id"],
      include: [
        {
          model: models.Role,
          as: "Role",
          where: {
            name: "Executive",
          },
          attributes: [],
        },
      ],
      raw: true,
    });
    if (!executive) {
      throw new Error("Invalid executive " + empCode);
    }
    return executive.id;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getExecutiveCustomer,
  importExcelAllFormat,
};

const models = require("../models");
// async function pageParams(req, res) {
//   let whereClause = {};
//   const queryParams = req.query;
//   for (const [key, value] of Object.entries(queryParams)) {
//     whereClause[key] = value;
//   }
//   try {
//     if (Object.keys(whereClause).length === 0) {
//       throw new Error();
//     }
//     const results = await models.dummy.findAll({
//       where: whereClause,
//     });
//     res.status(200).send(results);
//   } catch (error) {
//     console.error({ error: error });
//     res
//       .status(500)
//       .send({ error: "Please check the parameters that you are passing." });
//   }
// }

async function pagination(req, res) {
  const queryParams = req.query;
  let { page = 1, pageSize = 10 } = queryParams;
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  // offset is used to skip number of records
  const offset = (page - 1) * pageSize;
  try {
    const results = await models.dummy.findAll({
      limit: pageSize,
      offset: offset,
    });
    const totalCount = await models.dummy.count();
    res.status(200).json({
      currentPage: page,
      pageSize: pageSize,
      totalCount: totalCount,
      results: results,
    });
  } catch (error) {
    console.error("Error fetching paginated results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = pagination;
// module.exports = pageParams;

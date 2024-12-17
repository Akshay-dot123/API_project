// Static Bulk Creation
// const postRegister = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       email: Joi.string()
//         .email()
//         .regex(/@(gmail\.com|.*\.in)$/)
//         .required(),
//       password: Joi.string().min(6).required(),
//     });
//     const registers = [
//       {
//         email: "akshay123@gmail.com",
//         password: "Prabhu123",
//       },
//       {
//         email: "krati12@gmail.com",
//         password: "Prabhu987",
//       },
//     ];
//     const createdRegisters = [];
//     for (const register of registers) {
//       // console.log("Regsiter",register.password);
//       // const hashedPassword = await bcrypt.hash(register.password, 8);
//       // console.log(register.password);
//       // console.log(hashedPassword);
//       // const isMatch = await bcrypt.compare("Password", hashedPassword);
//       // console.log(isMatch);

//       const { error } = schema.validate(register);
//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }
//       const hashedPassword = await bcrypt.hash(register.password, 8);
//       const newRegister = {
//         email: register.email,
//         password: hashedPassword,
//       };

//       // Save to the database
//       const createdRegister = await models.Register.create(newRegister);
//       createdRegisters.push(createdRegister); // Add created register to array
//     }

//     // Respond with all created registers
//     res.status(201).json(createdRegisters);
//   } catch (error) {
//     console.error("Error fetching registers:", error);
//   }
// };


// Dynamic Single Creation
// const postRegister = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const createCount = await models.Register.create({ email, password });
//     console.log(createCount);
//   } catch (error) {
//     console.error("Error fetching registers:", error);
//   }
// };


// Static Updation
// const updateRegsiter = async (req, res) => {
//   try {
//     const updateOne = await models.Register.update(
//       { email: "kratikap@gmail.com", password: "Akshay123" },
//       { where: { id: 8 } }
//     );
//     res.status(201).json(updateOne);
//   } catch (error) {
//     console.error("Error fetching registers:", error);
//   }
// };



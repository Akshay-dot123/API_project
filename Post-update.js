const Joi = require('joi');

// Post code

// const postRegister = async (req, res) => {
//   try {
//     const createdRegisters = [];
//     const registers = req.body;
//     for (const reg of registers) {
//       console.log(reg.email);
//       // console.log(registers.email);
//       let validationResults = registers.map((register) => {
//         let err = Schema.validate(register);
//         if (err && err.error && err.error.details && err.error.details[0] && err.error.details[0].message) {
//           res.status(404).send(err.error.details[0].message);
//         }

//           // const isUnique =await isEmailUnique(reg.email);
//           // console.log("unique Email",isUnique);

//           // console.log(reg.email);
//           // if (isUnique) {
//           //    res.status(404).send();
//           // }
//         // }
//       });
//       // console.log("Post Register===========>", validationResults);

//       // if (err) {
//       //   res.status(404).send(err.error.details[0].message);
//       //   console.log("Error in validation =>", err.error.details[0].message);
//       // }

//       // const errors = validationResults.filter((result) => result.error);
//       // console.log(errors);

//       // if (errors) {
//       //   const errorMessages = errors.map((err) => err.error.details[0].message);
//       //   return res.status(400).json({ errors: errorMessages });
//       // }
//       // const hashedPassword = await bcrypt.hash(register.password, 8);
//       // console.log("Hashed Password ========>", hashedPassword);
//       // console.log("Real Password =========>", register.password);
//       // const newRegister = {
//       //   email: register.email,
//       //   password: hashedPassword,
//       // };
//       // const createdRegister = await models.Register.create(newRegister);
//       // createdRegisters.push(createdRegister);
//       // res.status(201).json(` User named ${register.email} is created`);
//     }
//   } catch (error) {
//     console.error("Error fetching registers:", error);
//   }
// };


// Update code

// Define the validation schema
const putSchema = Joi.object({
  id: Joi.number().required(), // Ensure ID is provided and is a number
  email: Joi.string()
    .email()
    .regex(/@(gmail\.com|.*\.in)$/)
    .optional(), // Make email optional for update
  password: Joi.string().min(6).optional(), // Make password optional for update
});

// Update register function
const updateRegister = async (req, res) => {
  const { id, email, password } = req.body;

  // Validate input against schema
  const { error } = putSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Create an object to hold the fields to be updated
    const updateFields = {};
    
    // Only add fields that are provided in the request body
    if (email) {
      updateFields.email = email;
    }
    
    if (password) {
      // Hash the password before updating (if provided)
      const hashedPassword = await bcrypt.hash(password, 8);
      updateFields.password = hashedPassword;
    }

    // Update the register record in the database
    const [updatedCount] = await models.Register.update(updateFields, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Register not found' });
    }

    res.status(200).json({ message: 'Register updated successfully', updatedCount });
    
  } catch (error) {
    console.error("Error updating register:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Example usage in an Express route
// app.put('/register', updateRegister);
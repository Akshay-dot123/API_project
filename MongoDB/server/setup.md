1) Sign in using Mongodb Atlas, create a DB and collection
2) In Nodejs connect using below:
mongoose.connect("mongodb+srv://akshaytest234:<Password>@cluster0.usgz9.mongodb.net/<db_name>")
Here If @ symbol exists in password put %40
3) Always allow current ip address(which displays as option in mongodb atlas) or else allow 0.0.0.0/0 with any message, this creates db and collection
# Note: There should be atleast 1 collection to create a db which also creates collection.mongoose.connect() only establishes connection with MongoDB. After successful connection, MongoDB/Mongoose may automatically create db and collection if does not exists and does not remove existing data, whereas sequleize.sync() in mysql method is quite different which might remove/add/delete data based on conditions like alter or force.

4) import the (table)model in server.js file to create new collection in Mongodb Atlas like this: const productModel=require("./models/Product") or require("./models/Product")

5) Now in above step there is problem, importing many models in server.js is not good practice, so there are 2 ways:
# Way 1: Auto-load all model files( This is not required as Way 2 method is best)
const fs = require("fs");
const path = require("path");
const modelsPath = path.join(__dirname, "models");
fs.readdirSync(modelsPath).forEach(file => {
   require(path.join(modelsPath, file));
});

# Way 2: create routes and import in server.js files, it will also import the models which does not have any routes defined but used internally for example if user logic is using product model, then it will also create collection of product also
const userRoutes=require("./routes/userRoutes");
app.use('/user',userRoutes);
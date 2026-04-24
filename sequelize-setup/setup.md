# Note:-

a) sequelize.sync() -> Which does not add columns in same table if new column is added
b) sequelize.sync({alter:true}) -> Which will delete/add column, also if datatype is changed it will convert before failing, if not will give error. But it will never delete existing data of non deleted column.
c) sequelize.sync({force:true}) -> Which will delete all tables and recreates it, where all data is lost. So sequelize recommends to use migration.

1. install sequelize, sequelize-cli
2. npx sequelize-cli init :- This will create config, models, migrations and seeders folder
3. We will create a table named 'users' in models and also in migration table automatically through running migration command npx sequelize-cli model:generate --name users --attributes email:string,password:string
4. Add "migrate": "sequelize-cli db:migrate", "migrate:undo": "sequelize-cli db:migrate:undo" in package.json and run npm run migrate
5. Now here 2 tables are created sequelizeMeta and users table in DB

# Note:- Here The sequelize-cli command generates code based on its internal default templates, which changed in Sequelize v6+ to use the class-based init() pattern. Your existing project, however, uses the older (but still fully valid) sequelize.define() pattern.

6. If u want u can manually adjust generated files, but we are not doing that
7. Now to have relations(associations) we are creating new migration with field named user_id for users table with below code written in up migration:-
   await queryInterface.addColumn('orders', 'user_id', {
   type: Sequelize.INTEGER,
   allowNull: true, // ⚠️ Must be true initially for existing rows
   comment: 'Foreign key referencing users.id'
   });
   await queryInterface.addConstraint('orders', {
   fields: ['user_id'],
   type: 'foreign key',
   name: 'fk_orders_user_id', // optional but helpful for debugging
   references: {
   table: 'users',
   field: 'id',
   },
   onDelete: 'CASCADE', // ✅ This is what actually enables cascade delete
   onUpdate: 'CASCADE',
   });
   },

and also need to add this field in both users, orders model
In orders model for define association:- order.belongsTo(models.user, {
foreignKey: 'user_id', // must match the FK defined in hasMany
targetKey: 'id', // optional, default is 'id'
});
In users model for define association:-
user.hasMany(models.order, {
foreignKey: 'user_id', // snake_case FK (matches underscored: true)
sourceKey: 'id', // optional, default is 'id'
onDelete: 'CASCADE', // optional: delete orders when user is deleted
onUpdate: 'CASCADE',
});

8. U can create a view table using migration, to query u can create model of that created view table or write basic query like sequelize.query to get table details

9. # TRIGGER:- "It fires automatically, and I can log/calculate whatever I want"

# STORED PROCEDURE:- "A saved query I call manually, and it can do CRUD"

Also here no need to create model if u directly query using sequelize.query


### Bcrypt (Hashing password)

1. While inserting new user with password we use const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
   And we save this password in users table as:- await user.create({email,password:hashedPassword});
2. While comapring we use await bcrypt.compare(password, oldUser.password);


### JWT Token Storage(Note:- Here JWT token is not working as expected can be used for referrence purpose)

Note: Refresh and access token is generated during login not during account creation, which must be sent for Frontend.
But always remember to never send refresh token in res.json, send in res.cookie format(Although this is not problem as mentioned by Keerthan)

1. Normally JWT token is generated using function jwt.sign({userId, email}) to generate access token and jwt.sign({userId}) to generate refresh token
2. We can install cookie-parser and send cookie in jwt like this:-
   res.cookie('accessToken', token, {
   httpOnly: true, // ❌ JS can't access (blocks XSS theft)
   secure: false, // ✅ Set to true in production (HTTPS only)
   sameSite: 'lax', // ✅ Helps prevent CSRF
   maxAge: 15 _ 60 _ 1000 // 15 minutes
   });
   res.cookie('refreshToken', refreshToken, { // ← ALSO send refresh token!
   httpOnly: true, // ✅ JS cannot read (blocks XSS)
   secure: process.env.NODE*ENV === 'production',
   sameSite: 'lax',
   maxAge: 7 * 24 _ 60 _ 60 \_ 1000 // 7 days
   });
   // or like below
   res.json({
   message: 'Logged in via header',
   accessToken: token, // ← Frontend saves this
   user: { email }
   });

3) Here in backend we need to save refreshtoken only 1 per user(also we can cryptohash token to store it, so attacker cannot do anything even if get access to DB).
4) We are creating a new middleware(auth.js) which validates the token given by frontend, this middleware internally calls verifyToken function with jwt.verify(token, secret);
5) We use same middleware(auth.js) for other routes to check whether the token exists and is valid or not to give further access.
6) If auth middleware fails 401 with Token Expired, Frontend calls auth/refresh api from backend
7) Verifies refreshToken sent by Frontend, then send new accesstoken
8) Frontend must automatically retry that original request with the new accesstoken.
9) Now when refresh token expires, Backend gives error as "Token expired", where Frontend redirects to login page for user to manually enter correct credentials again.

# Deep Concept of refresh token rotation

10. Bonus:- U can also rotate refresh token like when access token is expired, then frontend sends refresh token, then backend can regenerate both new access and refresh token by clearing "existing refresh token" in DB and send to Frontend. In this way refresh token will always be new one, so if attacker gets old refresh token, no use.
But what if hacker also gets new refresh token??
so here we can handle in 2 ways, where method (a) is very less secure:-
a) then both can continue till accesstoken invalid, after that while validating with refresh token whoever logs in first will be allowed to access, next user will be given error.
so real user has to manually login again and here real user is given access with new refresh and access token.
Since the system stores only one refresh token per user and overwrites it in the database, any previously issued refresh token becomes invalid.
After hackers access token is invalidated, cannot continue as refresh token will be old
b) Best way: If same token is detected, kill all sessions force user to login again.
the system forces re-authentication, ensuring that only a legitimate user with valid credentials can regain access


### Running Redis (Dont know whether this works or not as I cannot test in my system)

1. Install docker desktop or atleast need docker engine running, then run this command docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
2. In cmd Open localhost:8001 to get redis gui
3. docker ps -> Will provide container ID
4. docker exec -it container ID bash ->
5. redis-cli
6. In Nodejs Application run npm i ioredis
7. create a client.js file and add given things

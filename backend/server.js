const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const tenderRoutes = require('./endpoints')
const org1Routes = require('./registerlogin')
const authController = require('./controllers/authController');
const org2Routes = require('./org2registerlogin');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/tenders', tenderRoutes);
app.use('/api/org1',org1Routes);
app.use('/api/org2',org2Routes);


// MongoDB connection
mongoose.connect('mongodb+srv://procurewatch:ProcureWatch2026@cluster0.pqcyvgd.mongodb.net/Procure-Watch')
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));

// Routes
// app.post('/register', (req, res) => {

//     return res.status(200).json({
//         success: true,
//         msg: "POST request successful",
        
//     })});
// app.post('/register',authController.register);
// app.post('/login', authController.login);

// app.post('/registerUser', async function (req, res, next) {
//     try {
//         let role; 
//         let {adminId, doctorId, userId, name, dob, city} = req.body;

//         // check request body
//         console.log("Received request:", req.body);
//         if (req.body.userId && req.body.adminId) {
//             userId = req.body.userId;
            
//             adminId = req.body.adminId;
//         } else {
//             console.log("Missing input data. Please enter all the user details.");
//             throw new Error("Missing input data. Please enter all the user details.");
//         }
        
//         role='patient';

//         //call registerEnrollUser function and pass the above as parameters to the function
//         const result = await helper.registerUser(adminId, doctorId, userId, role, { name, dob, city});
//         console.log("Result from user registration function:", result);

//         // check register function response and set API response accordingly 
//         res.status(200).send(result);
//     } catch (error) {
//         console.log("There was an error while registering the user. Error is ", error);
//         next(error);
//     }  
// });

// app.post('/loginUser', async function (req, res, next){
//     try {
//         let userId;

//         // check request body        
//         if (req.body.userId) {
//             userId = req.body.userId;
            
//         } else {
//             console.log("Missing input data. Please enter all the user details.");
//             throw new Error("Missing input data. Please enter all the user details.");
//         }

//         const result = await helper.login(userId);
//         console.log("Result from user login function: ", result);
//         //check response returned by login function and set API response accordingly
//         res.status(200).send(result);
//     } catch (error) {
//         console.log("There was an error while logging in. Error is ", error);
//         next(error);
//     }

// });


// app.get('/',(req,res)=>{res.send("Hello")})

// Server
app.listen(3000, () => console.log("Server running on port 3000"));

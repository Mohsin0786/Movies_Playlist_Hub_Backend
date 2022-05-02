const express = require('express');
const app = express();
var cors = require('cors')
require('dotenv').config()
const { mongoConnect } = require("./utils/dbUtils");
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlist');
const BodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({response:"Running good"})
})
app.use("/api/auth",authRoutes);
app.use("/api",playlistRoutes);
app.listen(PORT,()=>{
    console.log("Server running");
});
mongoConnect()
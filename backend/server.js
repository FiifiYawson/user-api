const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", require("./routes/userRoutes"));

switch (process.env.NODE_ENV) {
    case "development":
        mongoose.connect(`${process.env.MONGO_URI_LOCAL}`).then(() => {
            console.log("mongodb is connected locally");
            app.listen(process.env.PORT, console.log(`server running on PORT: ${process.env.PORT}`));
        }).catch((err) => {
            throw new Error(err);
        })

        break;

    case "production":
        mongoose.connect(`${process.env.MONGO_ATLAS}`).then(() => {
            console.log("mongodb connected to atlas");

            app.use(express.static(path.join(__dirname, "../frontend/build")));

            app.get("*", (req, res) => {
                res.sendFile(path.join(__dirname, "../frontend/build/index.js"));
            })
        }).catch((err) => {
            throw new Error(err);
        })
}
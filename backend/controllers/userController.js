const users = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
    try {
        if (await users.exists({ uniqueCredential: req.body.uniqueCredential })) {
            res.status(400).json({
                message: "a user already exists with this credentials",
            });
        } else {
            const salt = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req.body.password, salt);

            const user = await users.create(req.body);

            const token = jwt.sign(JSON.stringify(user), process.env.SECRET);

            res.status(201).json({
                message: "user was created successfully",
                user,
                token,
            });
        }
    } catch (error) {
        console.log(error);

        await users.deleteOne({ uniqueCredential: req.body.uniqueCredential })
        res.status(500).json({
            message: "server error",
        });

    }
}

async function loginUser(req, res) {
    try {
        const user = await users.findOne({ uniqueCredential: req.body.uniqueCredential });

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = await jwt.sign(JSON.stringify(user), process.env.SECRET);

            res.status(200).json({
                message: "user login successful",
                user,
                token,
            });
        } else if (user) {
            res.status(400).json({
                message: "incorrect password",
            })
        } else {
            res.status(400).json({
                message: "no user user with this username",
            })
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "server error",
        });
    }
}

async function deleteUser(req, res) {
    try {
        const valid = await users.findByIdAndDelete(req.payload._id);

        if (valid) {
            res.status(200).json({
                message: "user deleted successfully",
            });
        } else {
            res.status(300).json({
                message: "user delete wasn't successful",
            });
        }
    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error",
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
}
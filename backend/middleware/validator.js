const jwt = require("jsonwebtoken");

async function validate(req, res, next) {
    try {
        const auth = req.headers.authorization.split(" ");

        if (auth[0] === "Bearer" && auth[1]) {
            payload = await jwt.verify(auth[1], process.env.SECRET);

            if (payload) {
                req.payload = payload;

                next();
            } else {
                res.send(401).json({
                    message: "user is not authorized",
                });
            }
        }
    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "server error",
        })
    }
}

module.exports = validate;
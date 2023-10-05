const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Access Denied" });
  }
  jwt.verify(token, process.env.key, async function (err, decoded) {
    if (err) {
      return res.status(404).send({ message: err.message });
    }
    req.body.userId = decoded.userId;
    // console.log("decodedData", decoded);
    next();
  });
};

module.exports = {
  authentication,
};

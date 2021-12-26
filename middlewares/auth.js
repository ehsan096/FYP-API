const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");
async function auth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");
  try {
    let user = await jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = await User.findById(user._id);
    console.log("req.user > ", user, " tokens > ", token);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
}
module.exports = auth;

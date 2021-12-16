function admin(req, res, next) {
  console.log("Author role > ", req.user, " req.body.role", req.body.role);
  if (req.user.role != "admin")
    return res.status(403).send("You are not authorized");
  next();
}
module.exports = admin;

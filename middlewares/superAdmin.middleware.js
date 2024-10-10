const isSuperAdmin = async (req, res, next) => {
  if (req.user?.role === "superAdmin") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized access." });
  }
};

module.exports = { isSuperAdmin };

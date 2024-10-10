const isAdminOrSuperAdmin = async (req, res, next) => {
  const userRole = req.user?.role;

  if (userRole === "admin" || userRole === "superAdmin") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized access." });
  }
};

module.exports = { isAdminOrSuperAdmin };

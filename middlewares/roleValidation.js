// Middleware to check if the user has the correct role to create a new user
export const checkRole = (req, res, next) => {
  const { role, userRole } = req.body; // Assuming `userRole` comes from the authenticated user

  // If the user's role is superadmin, they can create both admin and user roles
  if (userRole === "superadmin") {
    if (role === "admin" || role === "user") {
      return next();
    } else {
      return res.status(403).json({
        error: "Superadmin can only create admin or user roles.",
      });
    }
  }

  // If the user's role is admin, they can only create user roles
  if (userRole === "admin") {
    if (role === "user") {
      return next();
    } else {
      return res.status(403).json({
        error: "Admin can only create user roles.",
      });
    }
  }

  // If the user's role is neither superadmin nor admin, deny access
  return res.status(403).json({
    error: "Unauthorized to create new users.",
  });
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role || null;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
        }
    };
};

module.exports = roleMiddleware;
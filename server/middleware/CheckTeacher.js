const checkTeacher = (req, res, next) => {
    if (req.user.userType !== 'teacher') {
        return res.status(403).json({ error: 'Unauthorized: Only teachers are allowed to perform this action' });
    }
    next();
};

module.exports = checkTeacher;
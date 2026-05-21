const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied',
        status: 403,
      })
    }

    next()
  }
}

module.exports = roleMiddleware
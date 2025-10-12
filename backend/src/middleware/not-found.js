const notFoundMiddleware = (req, res, next) => res.status(403).json({message: 'Route does not exist'});

export default notFoundMiddleware;
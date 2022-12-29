
const errorHandler = async(err,req,res) => {
    const statusCode = req.statusCode || 500;
    res.status(statusCode).json({
        msg: err.message,
        stack: process.env.NODE_ENV==='production'?'null':err.stack
    })
}

module.exports = errorHandler;
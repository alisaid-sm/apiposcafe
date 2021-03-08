const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../helpers/env')
const { failed } = require('./response')

const auth = {
    authentication: (req, res, next ) => {
        const token = req.headers.token
        if (!token || token === '') {
            failed(res, 400, [], 'failed(Required token)')
        } else if (token) {
            jwt.verify(token, JWT_KEY, (err, decoded) => {
                if (err && err.name === 'TokenExpiredError') {
                    failed(res, 400, [], 'failed(Token Expired)')
                } else if (err) {
                    failed(res, 400, [], 'failed(Incorrect token)')
                } else {
                    next()
                }
            })
        } else {
            next()
        }
    },
    authorization: (req, res, next) => {
        const token = req.headers.token
        const data = jwt.decode(token)
        if (data.role !== 'admin') {
            failed(res, 401, [], 'failed(required admin)')
        } else {
            next()
        }
    }
}

module.exports = auth
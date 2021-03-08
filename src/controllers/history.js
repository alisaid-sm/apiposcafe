const historyModels = require('../models/history')
const upload = require('../helpers/upload')
const { success, failed, successWithMeta } = require('../helpers/response')

const history = {
    getAll: (req, res) => {
        try {
            historyModels.getAll()
                .then((result) => {
                    successWithMeta(res, 200, result.rows, { totalRows: result.rowCount }, 'ok')
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    getById: (req, res) => {
        try {
            historyModels.getById(req.params.id)
                .then((result) => {
                    success(res, 200, result.rows, 'ok')
                })
                .catch((err) => {
                    failed(res, 404, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    create: (req, res) => {
        try {
            historyModels.create(req.body)
                .then((result) => {
                    success(res, 201, result.rows, 'ok(created)')
                })
                .catch((err) => {
                    failed(res, 400, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    update: (req, res) => {
        try {
            historyModels.update(req.body, req.params.id)
                .then((result) => {
                    success(res, 200, result.rows, 'ok(updated)')
                })
                .catch((err) => {
                    failed(res, 400, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error'+ error.message)
        }
    },
    delete: (req, res) => {
        try {
            historyModels.delete(req.params.id)
                .then((result) => {
                    success(res, 200, result.rows, 'ok(deleted)')
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    }
}

module.exports = history
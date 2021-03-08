const categoryModels = require('../models/category')
const upload = require('../helpers/upload')
const { success, failed, successWithMeta } = require('../helpers/response')

const category = {
    getAll: (req, res) => {
        try {
            categoryModels.getAll()
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
            categoryModels.getById(req.params.id)
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
            categoryModels.create(req.body)
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
            categoryModels.update(req.body, req.params.id)
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
            categoryModels.delete(req.params.id)
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

module.exports = category
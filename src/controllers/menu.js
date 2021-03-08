const menuModels = require('../models/menu')
const upload = require('../helpers/upload')
const { success, failed, successWithMeta } = require('../helpers/response')
const fs = require('fs')

const menu = {
    getAll: (req, res) => {
        try {
            menuModels.getAll()
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
            menuModels.getById(req.params.id)
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
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        failed(res, 400, [], 'File too large, max size 100kb');
                    } else {
                        failed(res, 400, [], err);
                    }
                } else {
                    req.body.updatedat = ''
                    req.body.image = req.file.filename
                    menuModels.create(req.body)
                        .then((result) => {
                            success(res, 201, result.rows, 'ok(created)')
                        })
                        .catch((err) => {
                            failed(res, 400, [], err.message)
                        });
                }
            })
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    update: (req, res) => {
        try {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        failed(res, 400, [], 'File too large, max size 100kb');
                    } else {
                        failed(res, 400, [], err);
                    }
                } else {
                    menuModels.getById(req.params.id)
                        .then((result) => {
                            if (req.file) {
                              fs.unlinkSync(`src/images/${result.rows[0].image}`)
                              req.body.image = req.file.filename
                            }
                            const today = new Date(Date.now())
                            req.body.updatedat = today.toISOString()
                            menuModels.update(req.body, req.params.id)
                                .then((result) => {
                                    success(res, 200, result.rows, 'ok(updated)')
                                })
                                .catch((err) => {
                                    failed(res, 400, [], err.message)
                                });
                        })
                }
            })
        } catch (error) {
            failed(res, 500, [], 'internal server error'+ error.message)
        }
    },
    delete: (req, res) => {
        try {
            menuModels.getById(req.params.id)
                .then((result) => {
                    fs.unlinkSync(`src/images/${result.rows[0].image}`)
                    menuModels.delete(req.params.id)
                        .then((result) => {
                            success(res, 200, result.rows, 'ok(deleted)')
                        })
                        .catch((err) => {
                            failed(res, 500, [], err.message)
                        })
                })
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    }
}

module.exports = menu
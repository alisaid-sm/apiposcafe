const userModels = require('../models/user')
const upload = require('../helpers/upload')
const { JWT_KEY, EMAIL, PASSWORD_EMAIL, url, urlfe } = require('../helpers/env')
const { success, failed, successWithMeta } = require('../helpers/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')

const user = {
    getAll: (req, res) => {
        try {
            userModels.getAll()
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
            userModels.getById(req.params.id)
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
    signup: (req, res) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash
            userModels.signup(req.body)
                .then((result) => {
                    const token = jwt.sign({ email: req.body.email, role: 'user' }, JWT_KEY)
                    let transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                          user: EMAIL,
                          pass: PASSWORD_EMAIL
                        }
                      })
            
                    let mailOptions = {
                        from: `POSCAFE ${EMAIL}`,
                        to: req.body.email,
                        subject: `HELLO ${req.body.name}`,
                        html:
                          `Hai <h1><b>${req.body.name}<b></h1> </br>
                                PLEASE ACTIVATE YOUR EMAIL ! <br>
                                and You can Login with your <b>Email : ${req.body.email}<b> <br>
                                KLIK --> <a href="${url}user/activation/${token}"> Activation</a>  <---`
                      }
            
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                          failed(res, 505, [], err.message)
                        } else {
                          success(res, 201, [result], `Success Registration, Please activate your email`)
                        }
                      })
                })
                .catch((err) => {
                    failed(res, 400, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    activation: (req, res) => {
        try {
            if(req.params.token){
                jwt.verify(req.params.token, JWT_KEY, (err, decode) => {
                    if(err){
                        failed(res, 505, [], err.message)
                    }else{
                        const email = decode.email
                        const data = {
                            status: 1
                        }
                        userModels.credential( data ,email)
                            .then((result) => {
                                res.render('index', { email, urlfe })
                            })
                            .catch((err) => {
                                failed(res, 404, [], err.message)
                            });
                    }
                })
            }
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    signin: (req, res) => {
        try {
            userModels.signin(req.body)
                .then((result) => {
                    if (result.rows[0]) {
                        const match = bcrypt.compareSync(req.body.password, result.rows[0].password)
                        if (match && result.rows[0].status === 1) {
                            const email = result.rows[0].email
                            const role = result.rows[0].role
                            jwt.sign({ email, role }, JWT_KEY, { expiresIn: 3600},
                                (err, token) => {
                                    if (!err) {
                                        const email = result.rows[0].email
                                        const refreshtoken = jwt.sign({ email }, '123')
                                        userModels.credential({ refreshtoken }, email)
                                            .then(() => {
                                                const data = { token, refreshtoken }
                                                success(res, 200, data, 'ok(login success)')
                                            })
                                            .catch((err) => {
                                                failed(res, 400, [], err.message)
                                            })
                                    } else {
                                        failed(res, 400, [], err.message)
                                    }
                                }
                            );
                        } else if (result.rows[0].status !== 1) {
                            const email = result.rows[0].email
                            failed(res, 400, [], 'Email('+ email +') is not Actived yet')
                        } else {
                            failed(res, 400, [], 'Password incorrect')
                        }
                    } else {
                        failed(res, 400, [], 'Email('+ req.body.email +') is not registered')
                    }
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
            userModels.getById(req.params.id)
            .then((result) => {
                if (result.rows[0]) {
                    const match = bcrypt.compareSync(req.body.password, result.rows[0].password)
                    if (match && result.rows[0].status === 1) {
                        userModels.delete(req.params.id)
                            .then((result) => {
                                success(res, 200, result.rows, 'ok(akun deleted)')
                            })
                            .catch((err) => {
                                failed(res, 500, [], err.message)
                            });
                    } else if (result.rows[0].status !== 1) {
                        const email = result.rows[0].email
                        failed(res, 400, [], 'Email('+ email +') is not Actived yet')
                    } else {
                        failed(res, 400, [], 'Password incorrect')
                    }
                } else {
                    failed(res, 400, [], 'Email('+ req.body.email +') is not registered')
                }
            })
            .catch((err) => {
                failed(res, 500, [], err.message)
            });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    roleup: (req, res) => {
        try {
            userModels.getById(req.params.id)
                .then((result) => {
                    if (result.rows[0]) {
                        const match = bcrypt.compareSync(req.body.password, result.rows[0].password)
                        if (match && result.rows[0].status === 1) {
                            const email = result.rows[0].email
                            const role = result.rows[0].role
                            jwt.sign({ email, role }, JWT_KEY, { expiresIn: 3600},
                                (err, token) => {
                                    if (!err) {
                                        const email = result.rows[0].email
                                        const refreshtoken = result.rows[0].refreshtoken
                                        const role = 'admin'
                                        userModels.credential({ role }, email)
                                            .then(() => {
                                                const data = { token, refreshtoken }
                                                success(res, 200, data, 'ok(account upgraded)')
                                            })
                                            .catch((err) => {
                                                failed(res, 400, [], err.message)
                                            })
                                    } else {
                                        failed(res, 400, [], err.message)
                                    }
                                }
                            );
                        } else if (result.rows[0].status !== 1) {
                            const email = result.rows[0].email
                            failed(res, 400, [], 'Email('+ email +') is not Actived yet')
                        } else {
                            failed(res, 400, [], 'Password incorrect')
                        }
                    } else {
                        failed(res, 400, [], 'Email('+ req.body.email +') is not registered')
                    }
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    roledown: (req, res) => {
        try {
            userModels.getById(req.params.id)
                .then((result) => {
                    if (result.rows[0]) {
                        const match = bcrypt.compareSync(req.body.password, result.rows[0].password)
                        if (match && result.rows[0].status === 1) {
                            const email = result.rows[0].email
                            const role = result.rows[0].role
                            jwt.sign({ email, role }, JWT_KEY, { expiresIn: 3600},
                                (err, token) => {
                                    if (!err) {
                                        const email = result.rows[0].email
                                        const refreshtoken = result.rows[0].refreshtoken
                                        const role = 'user'
                                        userModels.credential({ role }, email)
                                            .then(() => {
                                                const data = { token, refreshtoken }
                                                success(res, 200, data, 'ok(account downgraded)')
                                            })
                                            .catch((err) => {
                                                failed(res, 400, [], err.message)
                                            })
                                    } else {
                                        failed(res, 400, [], err.message)
                                    }
                                }
                            );
                        } else if (result.rows[0].status !== 1) {
                            const email = result.rows[0].email
                            failed(res, 400, [], 'Email('+ email +') is not Actived yet')
                        } else {
                            failed(res, 400, [], 'Password incorrect')
                        }
                    } else {
                        failed(res, 400, [], 'Email('+ req.body.email +') is not registered')
                    }
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    chgusername: (req, res) => {
        try {
            userModels.getById(req.params.id)
                .then((result) => {
                    if (result.rows[0]) {
                        const match = bcrypt.compareSync(req.body.password, result.rows[0].password)
                        if (match && result.rows[0].status === 1) {
                            const email = result.rows[0].email
                            const role = result.rows[0].role
                            jwt.sign({ email, role }, JWT_KEY, { expiresIn: 3600},
                                (err, token) => {
                                    if (!err) {
                                        const email = result.rows[0].email
                                        const refreshtoken = result.rows[0].refreshtoken
                                        const name = req.body.name
                                        userModels.credential({ name }, email)
                                            .then(() => {
                                                const data = { token, refreshtoken }
                                                success(res, 200, data, 'ok(Username Changed)')
                                            })
                                            .catch((err) => {
                                                failed(res, 400, [], err.message)
                                            })
                                    } else {
                                        failed(res, 400, [], err.message)
                                    }
                                }
                            );
                        } else if (result.rows[0].status !== 1) {
                            const email = result.rows[0].email
                            failed(res, 400, [], 'Email('+ email +') is not Actived yet')
                        } else {
                            failed(res, 400, [], 'Password incorrect')
                        }
                    } else {
                        failed(res, 404, [], 'account is not found')
                    }
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    },
    reftoken: (req, res) => {
        try {
            userModels.reftoken(req.body)
                .then((result) => {
                    if (result.rows[0]) {
                        const email = result.rows[0].email
                        const role = result.rows[0].role
                        const token = jwt.sign({ email, role }, JWT_KEY, { expiresIn: 3600})
                        const refreshtoken = result.rows[0].refreshtoken
                        success(res, 200, { token, refreshtoken }, 'ok(token refreshed)')
                    } else {
                        failed(res, 400, [], 'refresh token failed')
                    }
                })
                .catch((err) => {
                    failed(res, 500, [], err.message)
                });
        } catch (error) {
            failed(res, 500, [], 'internal server error')
        }
    }
}

module.exports = user
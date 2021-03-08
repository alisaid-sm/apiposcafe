const db = require('../configs/connection')
const jsonSql = require('json-sql')()

const user = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM "public"."user"', (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM "public"."user" WHERE id=$1', [id], (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    signup: (data) => {
        const sql = jsonSql.build({
            type: 'insert',
            table: 'user',
            values: data
        })
        const query = {
            text: sql.query.replace(/\$p/g, '$'),
            values: Object.values(sql.values)
          }
        return new Promise((resolve, reject) => {
            db.query(query , (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    credential: (data, email) => {
        const sql = jsonSql.build({
            type: 'update',
            table: 'user',
            condition: {
                email
            },
            modifier: data
        })
        const query = {
            text: sql.query.replace(/\$p/g, '$'),
            values: Object.values(sql.values)
        }
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    signin: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM "public"."user" WHERE email='${data.email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    reftoken: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM "public"."user" WHERE refreshtoken='${data.refreshtoken}'`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM "public"."user" WHERE id=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    }
}

module.exports = user
const db = require('../configs/connection')
const jsonSql = require('json-sql')()

const history = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM history', (err, result) => {
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
            db.query('SELECT * FROM history WHERE id=$1', [id], (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    },
    create: (data) => {
        const sql = jsonSql.build({
            type: 'insert',
            table: 'history',
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
    update: (data, id) => {
        const sql = jsonSql.build({
            type: 'update',
            table: 'history',
            condition: {
                id
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
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM history WHERE id=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        })
    }
}

module.exports = history
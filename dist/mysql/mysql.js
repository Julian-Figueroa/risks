"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class MySQL {
    constructor() {
        this.conectado = false;
        console.log('Clase Inicializada');
        this.cnn = mysql.createConnection({
            host: 'localhost',
            user: 'node_user',
            password: '123456',
            database: 'risk_hunter',
            socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
        });
        this.conectarDB();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    static ejecutarQuery(query, callback) {
        this.instance.cnn.query(query, (err, res, flds) => {
            if (err) {
                console.log('Error Query: ', err.message);
                return callback(err);
            }
            if (res.length === 0) {
                callback('El registro no existe!!');
            }
            else {
                // console.log('Res: ', res);
                callback(null, res);
            }
        });
    }
    static ejecutarDML(query, add, callback) {
        this.instance.cnn.query(query, add, (err, res, flds) => {
            if (err) {
                console.log('Error Query: ', err.message);
                return callback(err);
            }
            if (res.length === 0) {
                callback('El registro no existe!!');
            }
            else {
                // console.log('Res: ', res);
                callback(null, res);
            }
        });
    }
    conectarDB() {
        this.cnn.connect((err) => {
            if (err) {
                console.log('Error DB: ', err.message);
                return;
            }
            this.conectado = true;
            console.log('Base de datos arriba');
        });
    }
}
exports.default = MySQL;

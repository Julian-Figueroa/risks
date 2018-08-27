import mysql = require('mysql');

export default class MySQL {
    private static _instance: MySQL;

    cnn: mysql.Connection;
    conectado: boolean = false;

    constructor() {
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

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    static ejecutarQuery(query: string, callback: Function) {
        this.instance.cnn.query(query, (err, res: Object[], flds) => {
            if (err) {
                console.log('Error Query: ', err.message);
                return callback(err);
            }

            if (res.length === 0) {
                callback('El registro no existe!!');
            } else {
                // console.log('Res: ', res);
                callback(null, res);
            }

        });
    }

    static ejecutarDML(query: string, add: any, callback: Function) {
        this.instance.cnn.query(query, add, (err, res: Object[], flds) => {
            if (err) {
                console.log('Error Query: ', err.message);
                return callback(err);
            }

            if (res.length === 0) {
                callback('El registro no existe!!');
            } else {
                // console.log('Res: ', res);
                callback(null, res);
            }

        });
    }

    private conectarDB() {
        this.cnn.connect((err: mysql.MysqlError) => {
            if (err) {
                console.log('Error DB: ', err.message);
                return;
            }

            this.conectado = true;
            console.log('Base de datos arriba');
        });
    }
}
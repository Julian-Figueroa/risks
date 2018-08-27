"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysql_1 = __importDefault(require("../mysql/mysql"));
const bcrypt_1 = require("bcrypt");
const router = express_1.Router();
const saltRounds = 10;
router.get('/users', (req, res) => {
    const query = `
        SELECT *
          FROM usuarios
    `;
    mysql_1.default.ejecutarQuery(query, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        else {
            res.json({
                ok: true,
                heroes: data
            });
        }
    });
});
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const escapedId = mysql_1.default.instance.cnn.escape(id);
    const query = `
        SELECT *
          FROM usuarios
         WHERE idUsuario = ${escapedId}
    `;
    mysql_1.default.ejecutarQuery(query, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        else {
            res.json({
                ok: true,
                heroe: data[0]
            });
        }
    });
});
router.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const escapedId = mysql_1.default.instance.cnn.escape(id);
    const query = `
        DELETE 
          FROM usuarios
         WHERE idUsuario = ${escapedId}
    `;
    mysql_1.default.ejecutarQuery(query, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
        else {
            res.json({
                ok: true,
                data: data[0]
            });
        }
    });
});
router.post('/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { nombre, apellido, password, correo, rol } = req.body;
    if (nombre && apellido && password && correo && rol) {
        yield bcrypt_1.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log('Hubo un error cifrando la contraseña ', err);
                return res.sendStatus(500).json({
                    ok: false,
                    message: 'Hubo un error cifrando la contraseña',
                    error: err
                });
            }
            const query = `
                    INSERT INTO usuarios SET ?
                    `;
            const user = {
                nombre,
                apellido,
                password: hash,
                correo,
                rol
            };
            mysql_1.default.ejecutarDML(query, user, (err, data) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        error: err
                    });
                }
                else {
                    res.json({
                        ok: true,
                        data: data[0]
                    });
                }
            });
        });
    }
    else {
        return res.status(500).json({
            ok: false,
            message: 'Información de usuario erronea'
        });
    }
}));
router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { password, correo } = req.body;
    if (password && correo) {
        const query = `
        SELECT * FROM usuarios WHERE correo = ?
        `;
        mysql_1.default.ejecutarDML(query, correo, (err, data) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Credenciales Incorectas - Correo',
                    error: err
                });
            }
            else {
                let dataQuery = JSON.parse(JSON.stringify(data));
                let pass2 = dataQuery[0].password;
                if (!bcrypt_1.compareSync(password, pass2)) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Credenciales Incorrectas - Contraseña '
                    });
                }
                res.json({
                    ok: true,
                    message: 'El usuario está autenticado',
                    user: dataQuery
                });
            }
        });
    }
}));
exports.default = router;

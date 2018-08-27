import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const router = Router();
const saltRounds = 10;
const seed = '@hard-to-get-seed';

router.get('/users', (req: Request, res: Response) => {

    const query = `
        SELECT *
          FROM usuarios
    `;

    MySQL.ejecutarQuery(query, (err: any, data: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                data: data
            });
        }
    });

});

router.get('/users/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    const escapedId = MySQL.instance.cnn.escape(id);

    const query = `
        SELECT *
          FROM usuarios
         WHERE idUsuario = ${ escapedId}
    `;

    MySQL.ejecutarQuery(query, (err: any, data: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                data: data[0]
            });
        }
    });

});

router.delete('/users/:id', (req: Request, res: Response) => {

    const id = req.params.id;

    const escapedId = MySQL.instance.cnn.escape(id);

    const query = `
        DELETE 
          FROM usuarios
         WHERE idUsuario = ${ escapedId}
    `;

    MySQL.ejecutarQuery(query, (err: any, data: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                data: data[0]
            });
        }
    });

});

router.post('/register', async (req: Request, res: Response) => {

    const { nombre, apellido, password, correo, rol } = req.body;

    if (nombre && apellido && password && correo && rol) {

        await bcrypt.hash(password, saltRounds, (err, hash) => {
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

            MySQL.ejecutarDML(query, user, (err: any, data: Object[]) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        error: err
                    });
                } else {
                    res.json({
                        ok: true,
                        data: data[0]
                    });
                }
            });
        });
    } else {
        return res.status(500).json({
            ok: false,
            message: 'Información de usuario erronea'
        });

    }
});

router.post('/login', async (req: Request, res: Response) => {

    const { password, correo } = req.body;

    if (password && correo) {

        const query = `
        SELECT * FROM usuarios WHERE correo = ?
        `;

        MySQL.ejecutarDML(query, correo, (err: any, data: Object) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Credenciales Incorectas - Correo',
                    error: err
                });
            } else {
                let dataQuery = JSON.parse(JSON.stringify(data));
                let pass2 = dataQuery[0].password;

                if (!bcrypt.compareSync(password, pass2)) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Credenciales Incorrectas - Contraseña '
                    });
                }

                // Token
                let token = jwt.sign({ user: dataQuery }, seed, { expiresIn: 14400 });


                res.json({
                    ok: true,
                    message: 'El usuario está autenticado',
                    user: dataQuery,
                    token
                });
            }
        });
    }
});

export default router;
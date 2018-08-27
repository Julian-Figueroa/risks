import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';
import { hash } from 'bcrypt'

const router = Router();
const saltRounds = 10;

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
                heroes: data
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
                heroe: data[0]
            });
        }
    });

});

router.post('/register', async (req: Request, res: Response) => {

    const { nombre, apellido, password, correo, rol } = req.body;

    if (nombre && apellido && password && correo && rol) {

        await hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log('THubo un error cifrando la contraseña ', err);
                res.sendStatus(500);
                return;
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
                    //console.log('User Data: ', data[0]);
                    res.json({
                        ok: true,
                        data: data[0]
                    });
                }
            });
        });
    } else {
        res.sendStatus(500);
        return;
    }
});

export default router;
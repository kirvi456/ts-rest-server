import { Router } from 'express';
import { check } from 'express-validator';

import { login, googleSignIn } from '../controllers/auth.controller';

import { validarCampos } from '../middlewares/validar-campos';

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('pw', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id_token es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);

export default router;
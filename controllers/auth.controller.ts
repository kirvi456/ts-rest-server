import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import { generarJWT } from "../helpers/generar-jwt";
import { googleVerify } from "../helpers/google-verify";

import Usuario from "../models/usuario";
import { getErrorMessage } from "../helpers/error-messages";

export const login = async (req: Request, res: Response) => {
    const { usuario, pw } = req.body;
    try {
        // Verificar si el email existe
        const usuarioInstancia = await Usuario.findOne({ usuario });
        if (!usuarioInstancia) {
        return res.status(400).json({
            msg: "Usuario / Contraseña no son correctos (Nombre Usuario)",
        });
        }

        // Verificar que el usuario este activo
        if (!usuarioInstancia.estado) {
        return res.status(400).json({
            msg: "Usuario desctivado. Comuníquese con el administrador",
        });
        }

        // Verificar la contraseña
        const validPW = bcryptjs.compareSync(pw, usuarioInstancia.pw);
        if (!validPW) {
        return res.status(400).json({
            msg: "Usuario / Contraseña no son correctos (Contraseña)",
        });
        }

        // Generar el JWT
        const token = await generarJWT(usuarioInstancia.id);
        res.json({
        usuarioInstancia,
        token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        msg: "Hable con el administrador",
        });
    }
};

export const googleSignIn = async (req: Request, res: Response) => {
    const { id_token } = req.body;

    try {
        const { usuario, nombre, img, correo } = await googleVerify(id_token);

        let usuarioInstancia = await Usuario.findOne({ correo });

        // Si no se encuentra registrado, proceder a hacer el registro
        if (!usuario) {
        const data = {
            nombre: nombre || "No nombre",
            usuario,
            corre: correo || "sincorreo@sincorreo.com",
            pw: "cuzon",
            img,
            google: true,
        };

        usuarioInstancia = new Usuario(data);
        await usuarioInstancia.save();
        }

        // Verificar que el usuario se encuentra activo
        if (!usuarioInstancia!.estado) {
        return res.status(401).json({
            msg: "[ERROR]: El usuario se encuentra inactivo",
        });
        }

        // Generar el JWT
        const token = await generarJWT(usuarioInstancia!.uid);

        res.json({
        usuario,
        token,
        });
    } catch (error) {
        console.log(error);
        res.json(500).json({
        msg: `[ERROR]: ${getErrorMessage(error)}`,
        });
    }
};

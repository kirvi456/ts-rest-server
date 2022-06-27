import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import Usuario, { IUsuario } from '../models/usuario';


function verifyDecodedToken(data: unknown): asserts data is IUsuario {
    if (!(data instanceof Object)) 
        throw new Error('Decoded token error. Token must be an object');
    if (!('uid' in data)) 
        throw new Error('Decoded token error. Missing required field "uid"');
}

export const validarJWT = async(req : Request, res : Response, next : NextFunction) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No se encontró el token a autorización'
        })
    }

    try{
        const decoded : unknown = jwt.verify( token, process.env.SECRETPRIVATEKEY! );

        verifyDecodedToken( decoded );

        const usuario = await Usuario.findById( decoded.uid );

        // Verificar que el usuario existe
        if( !usuario ){
            return res.status(401).json('[ERROR]: Atutenticación - Usuario no existe');
        }

        // Verificar que el usuario esta activo
        if( !usuario.estado ){
            return res.status(401).json('[ERROR]: Atutenticación - Usuario inactivo');
        }

        req.currentUser = usuario;

        next();
    }catch (error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

export default validarJWT;
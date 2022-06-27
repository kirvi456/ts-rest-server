import path from 'path';

import { Request, Response } from 'express';
import  bcryptjs from 'bcryptjs';

import Usuario from '../models/usuario';
import { subirArchivo, obtenerArchivoPath } from '../helpers/subir-archivo';


export const getUsuarios = async(req : Request, res : Response) => {
    
    const { limit = 5, begin = 0 } = req.query;
    const query = { estado : true };

    const [total, usuarios] = await Promise.all([
        await Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( parseInt( begin as string ) )
            .limit( parseInt( limit as string ) )
    ]);

    res.json({
        total,
        usuarios
    });
}

export const postUsuarios = async(req : Request, res : Response) => {
    
    const {nombre, correo, pw, rol} = req.body;

    const usuario = new Usuario({nombre, correo, pw, rol});

    // Encriptar contraseña
    // salt: numero de vueltas de encriptado, por defecto 10 (esto esta bien)
    const salt = bcryptjs.genSaltSync();
    usuario.pw = bcryptjs.hashSync(pw, salt);

    await usuario.save();

    res.json({
        usuario
    });
}

export const putUsuarios = async(req : Request, res : Response) => {

    const { id }= req.params;

    const { _id, pw, google, correo, rol, ...nuevaInfo } = req.body;

    if( pw ){
        // Encriptar contraseña
        // salt: numero de vueltas de encriptado, por defecto 10 (esto esta bien)
        const salt = bcryptjs.genSaltSync();
        nuevaInfo.pw = bcryptjs.hashSync(pw, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, nuevaInfo, {new: true});

    res.json({usuario});
}

export const actulizarImg = async(req : Request, res : Response) => {
    try {
        const id = req.currentUser.uid;
        const imgAnterior = req.currentUser.img;

        // Actualizar imagen borrando la anterior      
        const archivo = await subirArchivo(req.files!, 'img', 'usuarios/avatars', imgAnterior);

        const usuario = await Usuario.findByIdAndUpdate(id, { img: archivo}, { new: true});

        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            msg: '[ERROR]: No se pudo actualizar la fotografia. Contacte con el administrador.'
        })
    }
}

export const obtenerAvatar = async(req : Request, res : Response) => {
    try{
        const { id } = req.params;

        const { img } = await Usuario.findById( id ) || {img : ''};


        // Obtener la ruta del archivo o el notFound     
        const archivo = await obtenerArchivoPath('usuarios/avatars', img, 'not-avatar.png');

        res.sendFile( archivo );
    } catch (error){
        console.log(error);
        res.status( 500 ).json({
            msg: '[ERROR]: No se pudo actualizar la fotografia. Contacte con el administrador.'
        })
    }
}

export const deleteUsuario = async(req : Request, res : Response) => {
    const  { id } = req.params;

    // Setear el estado a false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado : false}, {new: true});

    // Obtener el usuario autenticado
    const usuarioAutenticado = req.currentUser;

    res.json({
        usuario,
        usuarioAutenticado
    });
}

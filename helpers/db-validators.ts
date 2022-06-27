import Rol  from '../models';
import Usuario from '../models';

export const esRolValido = async(rol = '') => {
    try{
        const existeRol = await Rol.findOne({rol});
        if(!existeRol) {
            throw new Error(`El rol <${rol}> no existe`);
        }
    } catch ( error ){
        console.log( error );
        throw new Error('[ERROR]: Error al buscar rol, contacte al administrador');
    }
}

export const emailExiste = async(correo = '') => {
    try {
        const existeEmail = await Usuario.findOne({correo});
        if(existeEmail) {
            throw new Error(`El email <${correo}> ya esta registrado`);
        }
    } catch ( error ){
        console.log( error );
        throw new Error('[ERROR]: Error al buscar email, contacte al administrador');
    }
}

export const existeUsuarioPorID = async(id = '') => {
    try{
        const existeUsuario = await Usuario.findById(id);
        if(!existeUsuario) {
            throw new Error(`El usuario id:<${id}> no existe`);
        }
    } catch ( error ){        
        console.log(error)
        throw new Error(`El usuario id:<${id}> no existe`);
    }
}


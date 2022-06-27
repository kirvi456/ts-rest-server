import { Schema, model } from 'mongoose';

export interface IUsuario {
    uid: string;
    nombre: string;
    usuario: string;
    correo: string;
    pw: string;
    rol: string;
    img?: string | undefined;
    estado?: boolean | undefined;
} 

const UsuarioSchema = new Schema({
    uid: {
        type : String,
        required: [true, 'El UID es obligatorio'],
        unique: true
    },
    nombre: {
        type : String,
        required: [true, 'El nombre es obligatorio']
    },
    usuario: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    pw: {
        type: String,
        required: [true, 'La contraseña es requerida'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: [true, 'El rol es requerido'],
    },
    estado: {
        type: Boolean,
        default: true
    }
});


UsuarioSchema.methods.toJSON = function() {
    const {__version, __v, pw, _id, ...usuario} = this.toObject();
    usuario.mongoID = _id;
    return usuario;
}

export default model('Usuario', UsuarioSchema);

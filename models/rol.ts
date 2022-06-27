import { Schema, model } from 'mongoose';

const RoleSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

export default model('Role', RoleSchema);
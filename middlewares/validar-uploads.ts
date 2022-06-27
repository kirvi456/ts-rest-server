import { Request, Response, NextFunction } from 'express';

export const contieneArchivo = (req : Request, res : Response, next : NextFunction) => {

    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: '[ERROR]: No hay archivos que subir'
        });        
    }

    next();
}

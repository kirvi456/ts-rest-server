import { Request, Response, NextFunction } from 'express';

export const esAdmin = (req : Request, res : Response, next : NextFunction) => {
    
    // Verificar que si se este pasando el usuario por el req
    if( !req.currentUser ){
        return res.status(500).json({
            msg: '[ERROR]: Se intenta validar el rol pero no se paso el usuario al Middleware'
        });
    }
    

    // Verificar que el rol asociado es ADMIN
    const { rol } = req.currentUser;

    if( rol !== 'ADMIN' ){
        return res.status(401).json({
            msg: '[ERROR]: Esta operación solo puede ser realizada por un administrador'
        })
    }

    next();
}


export const tieneRol = (roles : string[]) => {

    return (req : Request, res : Response, next : NextFunction) => {
        
        // Verificar que si se este pasando el usuario por el req
        if( !req.currentUser ){
            return res.status(500).json({
                msg: '[ERROR]: Se intenta validar el rol pero no se paso el usuario al Middleware'
            });
        }
        

        // Verificar que el rol asociado es ADMIN
        const { rol } = req.currentUser;

        if( !roles.includes(rol) ){
            return res.status(401).json({
                msg: `[ERROR]: Esta operación solo puede ser realizada con uno de estos roles: ${ roles }`
            })
        }

        next();
    }

}

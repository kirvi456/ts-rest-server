import { IUsuario } from '../../models/usuario'

declare global{
    namespace Express {
        interface Request {
            currentUser: IUsuario
        }
    }
}

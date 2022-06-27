import express, { Application } from 'express';
import cors from 'cors';

import userRoutes from '../routes/usuarios.routes';
import dbConenction from '../db/mongo.config';
import fileUpload from 'express-fileupload';


class Server {
    
    private app: Application;
    private PORT : string;
    private paths = {
        auth:           '/api/auth',

        buscar:         '/api/buscar',

        uploads:         '/api/uploads',

        usuarios:       '/api/usuarios',
    };

    constructor(){
        this.app = express();
        this.PORT = process.env.PORT || '3000';

        // Conectar con mi base de datos de mongo
        this.connectDB();

        // Establecer los middlewares globales
        this.middlewares();

        // Cargar las rutas
        this.routes();
    }

    async connectDB(){
        await dbConenction();
    }

    routes() {

        this.app.use(this.paths.usuarios, userRoutes);

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura del Body
        this.app.use( express.json() );

        // Configurar la carpeta publica
        this.app.use( express.static('public') );

        // Para manejar carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //para que cree la carpeta si no esta creada
        }));
    }

    start() {
        this.app.listen(this.PORT, () => {
            console.log(`Servidor corriendo en puerto ${this.PORT}`)
        });
    }

}

export default Server;
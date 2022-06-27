import mongoose, { ConnectOptions } from 'mongoose';

const dbConenction = async () => {
    try {

        const connectionString : string = ((process.argv[2] && process.argv[2] === 'production')
        ? process.env.MONGODB_CNN
        : process.env.MONGODB_CNN_DEV) || '';

        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);

        console.log('conectado a la base datos de MONGODB')
    }catch (error){
        console.log(error);
        throw new Error('Erro al momento de inicializar la base datos');
    }

}

export default dbConenction;
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CIENT_ID);

export async function googleVerify( token : string ) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    if( payload ) throw new Error('No se pudo loguear con Google');

    const { iss, name, picture, email } = ticket.getPayload()!;

    return {
        usuario: iss,
        nombre: name,
        img: picture,
        correo: email
    }

}

export default googleVerify;
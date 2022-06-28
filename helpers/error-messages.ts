
export const getErrorMessage = ( error : unknown ) : string => {
    if( typeof error === 'string' )
        return error.toString();
    else if ( error instanceof Error )
        return error.message;
    return 'Contacte con el administrador.';
}
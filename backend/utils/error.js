export const ErrorHandler = (StatusCode , mesaage)=>{
    const error = new Error();

    error.statusCode = StatusCode;
    error.message = mesaage;

    return error;
}
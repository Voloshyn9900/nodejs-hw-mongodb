import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
    console.log(err);
    if (err instanceof HttpError) {
        res.status(err.status).json({ status: err.status, message: err.name, data: err })
        return 
    }
    
    res.status(500).json({ message: 'Something went wrong', data: err.massage });  


}
import * as express from 'express';
import { authSeparator, tokenKey } from '../Secret/EncryptionKey';
import { verify } from 'jsonwebtoken';

export const checkAuthToken = (req: express.Request, _: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    req.auth = {
        auth_status: false,
        error_message: "",
        status: 401,
        uid: "",
        level: "",
        building_id : "",
        flat_id : ""
    }
    if (authHeader === undefined) {
        req.auth.status = 401;
        req.auth.auth_status = false;
        req.auth.error_message = 'Auth header not found';
        return (next());
    }
    const token = authHeader.split(authSeparator)[1];
    try {
        var decoded: any = verify(token, tokenKey);
        req.auth.auth_status = true;
        req.auth.uid = decoded.uid;
        req.auth.level = decoded.level;
        req.auth.building_id = decoded.building_id;
        req.auth.flat_id = decoded.flat_id;
        return (next());
    }
    catch (error) {
        req.auth.status = 401;
        req.auth.auth_status = false;
        req.auth.error_message = 'Unauthorized User';
        return (next());
    }
}

// app.use('/', (req, res, next) => {
//     const authHeader = req.get('Authorization');
//     if (authHeader === undefined) return res.status(401).send(new BaseResponse(401, undefined, ['Auth header not found']).toMap).end();
//     const token = authHeader.split(authSeparator)[1];
//     try {
//         var decoded: any = verify(token, tokenKey);
//         req.uid = decoded.uid;
//         req.level = decoded.level;
//         next();
//     }
//     catch (error) {
//         return res.status(401).send(new BaseResponse(401, undefined, ['Unauthorized User']).toMap).end();
//     }
// });
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
        level: ""
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
        return (next());
    }
    catch (error) {
        req.auth.status = 401;
        req.auth.auth_status = false;
        req.auth.error_message = 'Unauthorized User';
        return (next());
    }
}
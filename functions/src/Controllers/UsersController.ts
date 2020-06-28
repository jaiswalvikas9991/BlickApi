import * as express from 'express';
import UserService from '../Services/UsersService';
import { body } from 'express-validator';
// import { verify } from 'jsonwebtoken';
// import { tokenKey, authSeparator } from '../Secret/EncryptionKey';
// import BaseResponse from '../BaseResponse';
const app: express.Router = express.Router();

/*
    @author Vikas Jaiswal
*/

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

app.get('/user', UserService.getUserDataByUid);

// This is the api for the dashboard
app.get('/all_users', [body('building_id').not().isEmpty()], UserService.getAllUsersByBuilding);

export default app;
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

app.get('/user', UserService.getUserDataByUid);

// This is the api for the dashboard
app.get('/all_users', [body('building_id').not().isEmpty()], UserService.getAllUsersByBuilding);

export default app;
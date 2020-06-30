import * as express from 'express';
import UsersService from '../Services/UsersService';
import { body } from 'express-validator';
// import UserService from '../Services/UsersService';
// import { body } from 'express-validator';
// import { verify } from 'jsonwebtoken';
// import { tokenKey, authSeparator } from '../Secret/EncryptionKey';
// import BaseResponse from '../BaseResponse';
const app: express.Router = express.Router();

/*
    @author Vikas Jaiswal
*/

// This has been changed to a Graphql API.
//app.get('/user', UserService.getUserDataByUid);

// This is the api for the dashboard
//app.get('/all_users', [body('building_id').not().isEmpty()], UserService.getAllUsersByBuilding);

app.post('/add_guest', [
    body('car_number').trim().not().isEmpty().withMessage('Car Number must be provided to add a Guest')
], UsersService.addGuestByUser);

export default app;
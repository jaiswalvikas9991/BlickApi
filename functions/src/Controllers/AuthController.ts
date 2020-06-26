import * as express from 'express';
import { body } from 'express-validator';
import AuthService from '../Services/AuthService';
import AuthRepo from '../Repositories/AuthRepo';

const app: express.Router = express.Router();

//* Validation will not lead to rejection of the request it will just throw a error which we have to handle in the se
app.post('/user_signup', [
    body('password').trim().not().isEmpty().withMessage('Password Compulsory').isLength({ min: 5 }).withMessage('Password must be at least 5 Characters Long'),
    body('building_id').trim().not().isEmpty().withMessage('Building Id Compulsory'),
    body('flat_id').trim().not().isEmpty().withMessage('Flat Number Compulsory'),
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail().custom(async (email: string, { req }) => {
        const ifExists: boolean = await AuthRepo.Instance.checkIfEmailExists(email);
        if (ifExists) return (Promise.reject(new Error('Email Already Exists')));
        const auth_status = await AuthRepo.Instance.checkUserByBuildingId(req.body.building_id, req.body.email, req.body.flat_id);
        //req.auth_status = auth_status;
        console.log(auth_status);
        return(Promise.resolve());
    })
], AuthService.userSignUp);

app.post('/user_login', [
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail().custom(async (email: string) => {
        const ifExists: boolean = await AuthRepo.Instance.checkIfEmailExists(email);
        if (ifExists) return (Promise.resolve());
        return (Promise.reject('Email Does not Exists'));
    }),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 Characters Long'),
    //body('flat_id').isNumeric().withMessage('Flat Number Must be a Number').not().isEmpty().withMessage('Flat Number Compulsory')
], AuthService.userLogin);

export default app;
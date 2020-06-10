import * as express from 'express';
import { body } from 'express-validator';
import AuthService from '../Services/AuthService';
import Database from '../Firestore';

const app: express.Router = express.Router();

//* Validiation will not lead to rejection of the reqest it will just throw a error which we have to handle in the se
app.post('/user_signup', [
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail().custom(async (email: string) => {
        const ifExists: boolean = await Database.Instance.checkIfEmailExists(email);
        if (ifExists) return (Promise.reject('Email Alredy Exists'));
        return (Promise.resolve());
    }),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be atleat 5 Characters Long'),
    body('flat_no').isNumeric().withMessage('Flat Number Must be a Number').not().isEmpty().withMessage('Flat Number Compulsory')
], AuthService.userSignUp);

app.post('/user_login', [
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail().custom(async (email: string) => {
        const ifExists: boolean = await Database.Instance.checkIfEmailExists(email);
        if (ifExists) return (Promise.resolve());
        return (Promise.reject('Email Does not Exists'));
    }),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be atleat 5 Characters Long'),
    body('flat_no').isNumeric().withMessage('Flat Number Must be a Number').not().isEmpty().withMessage('Flat Number Compulsory')
], AuthService.userLogin);

export default app;
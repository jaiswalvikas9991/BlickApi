import * as express from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import Database from '../Firestore';
import { tokenKey } from '../Secret/EncriptionKey';

export default abstract class AuthService {
    private constructor() { };
    public static userSignUp = async (req: express.Request, res: express.Response) => {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(424).json({ success: false, errors: allErrors }).end();
        }
        try {
            const cred = await Database.Instance.userSignUp(req.body.email, req.body.password);
            //console.log(cred);
            const userObject = JSON.parse(JSON.stringify(cred));
            console.log(JSON.stringify(userObject));
            await Database.Instance.createNewUserDoc(userObject.user.uid);
            return res.status(200).json({ success: true }).end();
        }
        catch (error) {
            console.log(error);
            return res.status(424).json({ success: false, error: 'Database Error' }).end();
        }
    };
    public static userLogin = async (req: express.Request, res: express.Response) => {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(424).json({ success: false, errors: allErrors }).end();
        }
        try {
            const token = await Database.Instance.userLogin(req.body.email, req.body.password);
            const userObject = JSON.parse(JSON.stringify(token));
            const signedUid = jwt.sign(userObject.user.uid, tokenKey);
            console.log("This si the" + signedUid);
            return res.status(200).json({ done: true, token: signedUid }).end();
        }
        catch (error) {
            console.log(error);
            return res.status(424).json({ success: false, error: [error] }).end();
        }
    };
}
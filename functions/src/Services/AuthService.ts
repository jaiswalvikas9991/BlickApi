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
            return res.status(406).json({ status: 406, errors: allErrors }).end();
        }
        try {
            const cred = await Database.Instance.userSignUp(req.body.email, req.body.password);
            const userObject = JSON.parse(JSON.stringify(cred));
            // Adding the email to the building data
            await Database.Instance.addUserToFlat(req.body.building_id, req.body.flat_no, req.body.email);
            //console.log(JSON.stringify(userObject));
            await Database.Instance.createNewUserDoc(userObject.user.uid, req.body.email);
            const signedUid = jwt.sign(userObject.user.uid, tokenKey);
            return res.status(200).json({ status: 200, data: [{ token: signedUid }] }).end();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, errors: ['Server Error'] }).end();
        }
    };
    public static userLogin = async (req: express.Request, res: express.Response) => {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(406).json({ status: 406, errors: allErrors }).end();
        }
        try {
            const cred = await Database.Instance.userLogin(req.body.email, req.body.password);
            const userObject = JSON.parse(JSON.stringify(cred));
            const signedUid = jwt.sign(userObject.user.uid, tokenKey);
            //console.log("This si the" + signedUid);
            return res.status(200).json({ status: 200, data: [{ token: signedUid }] }).end();
        }
        catch (error) {
            console.log(error);
            return res.status(406).json({ status: 406, errors: [error] }).end();
        }
    };
}
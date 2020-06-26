import * as express from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import { tokenKey } from '../Secret/EncryptionKey';
import BaseResponse from '../BaseResponse';
import AuthRepo from '../Repositories/AuthRepo';
import { UserAuthModel } from '../Models/AuthModel';

export default abstract class AuthService {
    private constructor() { };
    public static async userSignUp(req: express.Request, res: express.Response) {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(406).json(new BaseResponse(406, undefined, allErrors).toMap).end();
        }
        try {
            const user: UserAuthModel = new UserAuthModel(req.body.email, req.body.password, req.body.building_id, req.body.flat_id);
            const cred = await AuthRepo.Instance.userSignUp(user.email, user.password);
            const userObject = JSON.parse(JSON.stringify(cred));
            // Adding the email to the building data
            if (user.buildingId === undefined || user.flatId === undefined) throw new Error('Got Empty Field');
            await AuthRepo.Instance.addUserToFlat(user.buildingId, user.flatId, user.email);
            //console.log(JSON.stringify(userObject));
            await AuthRepo.Instance.createNewUserDoc(userObject.user.uid, req.body.email);
            const signedUid = jwt.sign({ uid: userObject.user.uid, level: "user" }, tokenKey);
            // return res.status(200).json({ status: 200, data: [{ token: signedUid, user_name: req.body.email }] }).end();
            return res.status(200).json(new BaseResponse(200, [{ token: signedUid, user_name: user.email }], undefined).toMap).end();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(new BaseResponse(500, undefined, ['Server Error']).toMap).end();
        }
    };
    public static async userLogin(req: express.Request, res: express.Response) {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(406).json(new BaseResponse(406, undefined, allErrors).toMap).end();
        }
        try {
            const user: UserAuthModel = new UserAuthModel(req.body.email, req.body.password);
            const cred = await AuthRepo.Instance.userLogin(user.email, user.password);
            const userObject = JSON.parse(JSON.stringify(cred));
            const signedUid = jwt.sign({ uid: userObject.user.uid, level: "user" }, tokenKey);
            //console.log("This si the" + signedUid);
            // return res.status(200).json({ status: 200, data: [{ token: signedUid, user_name: req.body.email }] }).end();
            return res.status(200).json(new BaseResponse(200, [{ token: signedUid, user_name: user.email }], undefined).toMap).end();
        }
        catch (error) {
            console.log(error);
            return res.status(406).json(new BaseResponse(406, [error], undefined).toMap).end();
        }
    };
}
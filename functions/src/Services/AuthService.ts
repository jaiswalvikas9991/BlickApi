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
            if (user.buildingId === undefined || user.flatId === undefined) throw new Error('Got Empty Fields');
            const cred = await AuthRepo.Instance.userSignUp(user.email, user.password);
            const userObject = JSON.parse(JSON.stringify(cred));
            await AuthRepo.Instance.addUserToAuthData(userObject.user.uid, user.buildingId, user.flatId);
            await AuthRepo.Instance.addUserToFlat(user.buildingId, user.flatId, user.email);
            await AuthRepo.Instance.createNewUserDoc(userObject.user.uid, user.email, user.buildingId, user.flatId);
            const signedData = jwt.sign({ uid: userObject.user.uid, level: "user", building_id: user.buildingId, flat_id: user.flatId }, tokenKey);
            return res.status(200).json(new BaseResponse(200, [{ token: signedData, user_name: user.email, building_id: user.buildingId, flat_id: user.flatId}], undefined).toMap).end();
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
            const cred: any = await AuthRepo.Instance.userLogin(user.email, user.password);
            const authData: any = await AuthRepo.Instance.getAuthDataByUid(cred.user.uid);
            const signedData = jwt.sign({ uid: cred.user.uid, level: "user", building_id: authData.building_id, flat_id: authData.flat_id }, tokenKey);
            return res.status(200).json(new BaseResponse(200, [{ token: signedData, user_name: user.email, building_id: authData.building_id, flat_id: authData.flat_id }], undefined).toMap).end();
        }
        catch (error) {
            console.log(error);
            return res.status(406).json(new BaseResponse(406, [error], undefined).toMap).end();
        }
    };
}
import * as express from 'express';
import UserRepo from '../Repositories/UsersRepo';
import UserModel from '../Models/UserModel';
import { validationResult, Result, ValidationError } from 'express-validator';
import BaseResponse from '../BaseResponse';

/*
    @author VikasJaiswal
*/
export default abstract class UsersService {
    private constructor() { }

    public static async getUserDataByUid(_: any, req: express.Request) {
        //console.log(req.auth.uid);
        const data: {} = await UserRepo.Instance.getUserDataByUid(req.auth.uid);
        //console.table(data);
        return (data);
    }

    public static async getBuildingInfoById(_: any, req: express.Request) {
        const data: {} = await UserRepo.Instance.getBuildingInfoById(req.auth.building_id);
        return (data);
    }

    public static async getUsersInfoByFlat(_: any, req: express.Request) {
        const data: {} = await UserRepo.Instance.getUsersInfoByFlat(req.auth.building_id, req.auth.flat_id);
        return (data);
    }


    public static async getAllUsersByBuilding(req: express.Request, res: express.Response) {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            const error: Error = new Error('Validation Failed');
            throw (error);
        }
        const users: UserModel[] = await UserRepo.Instance.getAllUsersByBuilding(req.body.building_id);
        return (res.json({ data: users.map((user: UserModel) => user.toMap) }));
    }

    public static async addGuestByUser(req: express.Request, res: express.Response) {
        const errors: Result<ValidationError> = validationResult(req);
        //* This is where we handel the validation error
        if (!errors.isEmpty()) {
            const allErrors: any[] = errors.array().map((err) => err.msg);
            return res.status(406).json(new BaseResponse(406, undefined, allErrors).toMap).end();
        }
        if (!req.auth.auth_status) {
            return (res.status(401).send(new BaseResponse(401, undefined, [req.auth.error_message]).toMap));
        }
        try {
            const isCreated: boolean = await UserRepo.Instance.addGuestByUser(req.auth.uid, req.body.car_number);
            if (isCreated) return (res.status(200).send(new BaseResponse(200, [{ isGuestAdded: true }]).toMap).end());
            else throw new Error('Adding Guest Failed');
        }
        catch (error) {
            return (res.status(401).send(new BaseResponse(401, undefined, [error.message]).toMap))
        }
    }
}
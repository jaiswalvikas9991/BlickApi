import * as express from 'express';
import UserRepo from '../Repositories/UsersRepo';
import UserModel from '../Models/UserModel';
import { validationResult, Result, ValidationError } from 'express-validator';

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
    };

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
    };
}
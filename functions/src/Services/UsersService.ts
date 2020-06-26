import * as express from 'express';
import UserRepo from '../Repositories/UsersRepo';
import UserModel from '../Models/UserModel';
import { validationResult, Result, ValidationError} from 'express-validator';

/*
    @author VikasJaiswal
*/
export default abstract class UsersService {

    private constructor() { }

    public static getAllUsersByBuilding = async (req: express.Request, res: express.Response) => {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            const error: Error = new Error('Validaion Failed');
            throw (error);
        }
        const users: UserModel[] = await UserRepo.getAllUsersByBuilding(req.body.building_id);
        return (res.json({ data: users.map((user: UserModel) => user.toMap()) }));
    };

    public static getUserDataByUid = async (req: express.Request, res: express.Response) => {
        const user: UserModel = await UserRepo.getUserDataByUid(req.uid);
        return (res.json({ data: user.toMap() }));
    };

    // public setUser = async (data: User) => {
    //     await UserRepo.setUser(data);
    // };

    // public checkUser = async (carNumber: string): Promise<{ data: boolean }> => {
    //     const data: User[] = await UserRepo.getAllUsers();
    //     let allow: boolean = false;
    //     data.forEach((user: User) => {
    //         user.carNumbers.forEach((car: CarNumber) => {
    //             if (car.carNumber === carNumber) {
    //                 allow = true;
    //             }
    //         });

    //         user.guests.forEach((car: Guest) => {
    //             if (car.carNumber === carNumber) {
    //                 allow = true;
    //             }
    //         });
    //     });
    //     return ({ data: allow });
    // };
}
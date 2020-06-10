import * as express from 'express';
import UserService from '../Services/UsersService';
import {body} from 'express-validator';
const app : express.Router = express.Router();

/*
    @author Vika Jaiswal
*/

// This is the api for the dashboard
app.get('/all_users',[body('building_id').not().isEmpty()], UserService.getAllUsersByBuilding);

app.get('/user', UserService.getOneUserByEmail);

// app.post('/user', async (req: express.Request, res: express.Response) => {
//     const userService: UserService = UserService.Instance;
//     await userService.setUser(req.body);
//     res.status(200).json(req.body);
// });

// app.get('/check_user', async (req: express.Request, res: express.Response) => {
//     const userService: UserService = UserService.Instance;
//     const allow: { data: boolean } = await userService.checkUser(req.params.carNumber);
//     res.status(200).json(allow);
// });

// app.post('', async (req : express.Request, res : express.Response) => {
//     res.send("Hellow ");
// });
export default app;
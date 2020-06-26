import * as express from 'express';
import UserService from '../Services/UsersService';
import { body } from 'express-validator';
import { verify } from 'jsonwebtoken';
import { tokenKey } from '../Secret/EncryptionKey';
const app: express.Router = express.Router();

/*
    @author Vikas Jaiswal
*/
app.use('/', (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader === undefined) return res.status(401).send({ status: 401, errors: ['Auth header not found'] }).end();
    const token = authHeader.split(' ')[1];
    try {
        var decoded: any = verify(token, tokenKey);
        req.uid = decoded.token;
        req.level = decoded.level;
        next();
    }
    catch (error) {
        return res.status(401).send({ status: 401, errors: ['Unauthorized User'] }).end();
    }
});

// This is the api for the dashboard
app.get('/all_users', [body('building_id').not().isEmpty()], UserService.getAllUsersByBuilding);

app.get('/user', UserService.getUserDataByUid);

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
//     res.send("Hello ");
// });
export default app;
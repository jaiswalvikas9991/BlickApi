import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import UsersController from './Controllers/UsersController';
import AuthController from './Controllers/AuthController';
import * as cors from 'cors';
import * as graphqlHTTP from 'express-graphql';
import Schema from './Graphql/Schema';
import Resolvers from './Graphql/Resolvers';
import BaseResponse from './BaseResponse';
import { checkAuthToken } from './utils/Constants';

/*
    @author Vikas Jaiswal
*/

// This is used to add custom values to the req object
declare global {
    namespace Express {
        interface Request {
            auth: {
                auth_status: boolean,
                error_message: string,
                status: number,
                uid: string,
                level: string,
                building_id : string,
                flat_id : string
            }
        }
    }
}

const app = express();
app.use(bodyParser.json())
app.use(cors({ origin: true }));
app.use(express.json());

// TODO : Implement a method to secure the APIS
// app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try {
//         const tokenId = req.get('Authorization').split('Bearer ')[1];
//         let decoded = await admin.auth().verifyIdToken(tokenId)
//         res.status(200).send(decoded);
//     }
//     catch (err) {
//         res.status(401).send(err);
//     }
// });
app.use('/auth', AuthController);


app.use(checkAuthToken);
app.use('/user', UsersController);
app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: Resolvers,
    customFormatErrorFn: (error) => {
        if (!error.originalError) return (error);
        return (new BaseResponse(10, undefined, [error.message]));
    }
}));

app.use('/', (_, res) => {
    res.status(404).json({ data: "Route Not Found", status: 404 }).end();
});

export const api = functions.https.onRequest(app);
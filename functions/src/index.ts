import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import UsersController from './Controllers/UsersController';
import AuthController from './Controllers/AuthController';
import * as cors from 'cors';
// import * as admin from 'firebase-admin';

/*
    @author VikasJaiswal
*/
// This is used to add custom values to the req object
declare global {
    namespace Express {
        interface Request {
            auth_status: string
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

app.use('/user', UsersController);
app.use('/auth', AuthController);
app.use('/', (_, res) => {
    res.status(404).json({ data: "Route Not Found", status: 404 }).end();
});

export const api = functions.https.onRequest(app);


/* //* Stack overflow answer

    //* Repository is the layer between the database and the app
    Repositories: The repository is a gateway between your domain/business layer and a data mapping layer,
    which is the layer that accesses the database and does the operations.
    Basically the repository is an abstraction to you database access.

    //* Services is the main where bussinnes logic sits
    Service: The service should provide an API to your business logic, therefore being an abstraction to your repository,
    here is where I disagree, just a little, with @Cerad, the services should be the only ones with access to the repositories,
    otherwise it violates the Dependency Inversion Principle (D in SOLID), because the business layer is an abstraction of your data access layer.

    //* Controlles handle the routing and req validation eg.is the email in correct format etc.
    Controllers: The A/C objects works as a gateway between your input and the domain logic,
    is decides what to do with the  input and how to output the response.
*/
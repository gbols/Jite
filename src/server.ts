import 'dotenv/config';
import App from "./app";
import AuthenticationController from "./modules/users/authentication.controllers";
import { validateEnv } from "./utils/validateEnv";

validateEnv();

const app = new App(
    [
        new AuthenticationController()
    ],
    8888
);

app.listen();
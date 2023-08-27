import {cleanEnv, str} from "envalid";

export function validateEnv() {
    cleanEnv(process.env, {
        MONGO_URL: str(),
        JWT_SECRET: str()
    });
}
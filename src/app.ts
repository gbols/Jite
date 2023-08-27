import express, { Application } from "express";
import mongoose from "mongoose";
import { loggerMiddleware } from './middleware/logger';
import {errorMiddleware} from "./middleware/error"
import Controller from './interfaces/controller.interface';

class App {
    app: Application;
    port: number;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(loggerMiddleware);
        
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private async connectToTheDatabase() {
        try {
            const {
                MONGO_URL,
            } = process.env;
            await mongoose.connect(MONGO_URL);
        } catch (error) {
            console.log(`There was an error connecting to mongodb ${error}`)
        }

    }
}

export default App;
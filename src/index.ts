import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import * as morgan from 'morgan';
import {Routes} from "./routes";
import {Doctor} from "./entity/Doctor";
import {Appointment, AppointmentType} from "./entity/Appointment";

import {port} from './config';
import { validationResult } from "express-validator";

function handleError(err, req, res, next){
    res.status(err.statusCode || 500).send({message: err.message});
}

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(morgan('tiny'));
    
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route,
            ...route.validation, 
            async(req: Request, res: Response, next: Function) => {
            try{
                const errors = validationResult(req);
                if (!errors.isEmpty()){
                    return res.status(400).json({errors:errors.array()});
                }
                const result = await (new (route.controller as any))[route.action](req, res, next);
                res.json(result);
            } catch(err){
                next(err);
            }
            
        });
    });

    // setup express app here
    // ...

    // start express server
    app.use(handleError);
    app.listen(port);

    // insert new doctors for test
    const doctor1 = new Doctor();
    doctor1.firstName = "Vineela";
    doctor1.lastName = "Pentyala";
    await connection.manager.save(doctor1);

    const doctor2 = new Doctor();
    doctor2.firstName = "John";
    doctor2.lastName = "Smith";
    await connection.manager.save(doctor2);

    // await connection.manager.save(connection.manager.create(Doctor, {
    //     firstName: "John",
    //     lastName: "Smith",
    // }));

    //insert appointments
    const appointment1 = new Appointment();
    appointment1.patientFirstName = "Sai";
    appointment1.patientLastName = "Kasiraju";
    appointment1.appointmentDate ="2022-02-10";
    appointment1.appointmentTime ="10:00:00";
    appointment1.doctor = doctor1;
    await connection.manager.save(appointment1);

    const appointment2 = new Appointment();
    appointment2.patientFirstName = "Sai";
    appointment2.patientLastName = "Kasiraju";
    appointment2.appointmentDate ="2022-02-28";
    appointment2.appointmentTime ="13:30:00";
    appointment2.appointmentType= AppointmentType.FOLLOW_UP;
    appointment2.doctor = doctor1
    await connection.manager.save(appointment2);

    const appointment3 = new Appointment();
    appointment3.patientFirstName = "Jane";
    appointment3.patientLastName = "Doe";
    appointment3.appointmentDate ="2022-02-10";
    appointment3.appointmentTime ="14:00:00";
    appointment3.doctor = doctor1
    await connection.manager.save(appointment3);

    const appointment4 = new Appointment();
    appointment4.patientFirstName = "Random";
    appointment4.patientLastName = "Person";
    appointment4.appointmentDate ="2022-02-10";
    appointment4.appointmentTime ="10:00:00";
    appointment4.doctor = doctor2
    await connection.manager.save(appointment4);

    console.log(`Express server has started on port ${port}. Open http://localhost:${port}/ to see results`);

}).catch(error => console.log(error));

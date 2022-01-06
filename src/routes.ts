import { param, body } from "express-validator";
import {DoctorController} from "./controller/DoctorController";
import { AppointmentController } from "./controller/AppointmentController";

export const Routes = [{
    method: "get",
    route: "/doctors",
    controller: DoctorController,
    action: "all",
    validation:[]
}, {
    method: "get",
    route: "/doctors/:id",
    controller: DoctorController,
    action: "one",
    validation:[
        param('id').isInt({min:0}).withMessage('id must be a positive integer')
    ]
}, {
    method: "post",
    route: "/doctors",
    controller: DoctorController,
    action: "save",
    validation:[
        body('firstName').isString().withMessage('firstName must be a string'),
        body('lastName').isString().withMessage('lastName must be a string')
    ]
}, {
    method: "delete",
    route: "/doctors/:id",
    controller: DoctorController,
    action: "remove",
    validation:[
        param('id').isInt({min:0}).withMessage('id must be a positive integer')
    ]
}, {
    method: "post",
    route: "/doctors/:id/appointments",
    controller: AppointmentController,
    action: "save",
    validation:[]
}, {
    method: "get",
    route: "/doctors/:id/appointments",
    controller: AppointmentController,
    action: "all",
    validation:[]
}, {
    method: "delete",
    route: "/doctors/:id/appointments/:appointmentId",
    controller: AppointmentController,
    action: "remove",
    validation:[]
}];
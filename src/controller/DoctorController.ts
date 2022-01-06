import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Doctor} from "../entity/Doctor";

export class DoctorController {

    private doctorRepository = getRepository(Doctor);

    //lists all doctors
    async all(request: Request, response: Response, next: NextFunction) {
        return await Doctor.find();
    }

    //get a doctor based on their id
    async one(request: Request, response: Response, next: NextFunction) {
        const thisUser =  await Doctor.findOne(request.params.id);
        if (!thisUser) throw Error('Doctor does not exist');
        return thisUser;
    }

    //create a new Doctor
    async save(request: Request, response: Response, next: NextFunction) {
        const{
            firstName,
            lastName
        } = request.body;
        const doctor = Doctor.create({
            firstName: firstName,
            lastName: lastName
        });
        await doctor.save();
        return doctor;
    }

    //remove a doctor
    async remove(request: Request, response: Response, next: NextFunction) {
        const doctorToRemove = await Doctor.findOne(request.params.id);
        if (!doctorToRemove) throw Error('Doctor does not exist');
        await Doctor.remove(doctorToRemove);
    }

}
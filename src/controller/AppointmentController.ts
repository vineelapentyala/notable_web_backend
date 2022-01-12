import {getRepository, createQueryBuilder, DeleteQueryBuilder, getManager} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Appointment} from "../entity/Appointment";
import {Doctor} from "../entity/Doctor";
import { validate } from "class-validator";

export class AppointmentController {

    private appointmentRepository = getRepository(Appointment);

    // list all appointments for a doctor (can be filtered by date)
    async all(request: Request, response: Response, next: NextFunction) {

        let doctorAppointments;
        const doctor_id = request.params.id;
        const doctor = await Doctor.findOne(doctor_id);
        if (!doctor) throw Error(`Doctor with id ${doctor_id} does not exist`);
        if (request.query.date){
            doctorAppointments = await createQueryBuilder(
                'doctor'
            )
            .select('doctor')
            .from(Doctor, 'doctor')
            .leftJoinAndSelect(
                'doctor.appointments',
                'appointment'
            )
            .where('doctor_id = :doctorId', {doctorId : request.params.id})
            .andWhere('appointment.appointmentDate = :date', {date: request.query.date}).getOne();
            if (!doctorAppointments){
                return {"message": `No appointments for the doctor on ${request.query.date}`};
            }
        } else {
            doctorAppointments = await createQueryBuilder(
                'doctor'
            )
            .select('doctor')
            .from(Doctor, 'doctor')
            .leftJoinAndSelect(
                'doctor.appointments',
                'appointment'
            )
            .where('doctor_id = :doctorId', {doctorId : request.params.id}).getOne();
            if (!doctorAppointments){
                return {"message": "No appointments scheduled with this doctor"};
            }
        }
        return doctorAppointments;
        
    }
    //create a new appointment
    async save(request: Request, response: Response, next: NextFunction) {
        const doctor_id = request.params.id;
        const doctor = await Doctor.findOne(doctor_id);
        const {patientFirstName, patientLastName, appointmentDate, appointmentTime, appointmentType} = request.body;
        if (!doctor) throw Error('Doctor does not exist');
        const validTimes = ['00', '15', '30', '45'];
        if (!validTimes.includes(appointmentTime.substring(3,5))) throw Error('Invalid appointment time');
        //check for multiple appointments at the same time
        const doctorAppointments = await createQueryBuilder(
            'doctor'
        )
        .select('doctor')
        .from(Doctor, 'doctor')
        .leftJoinAndSelect(
            'doctor.appointments',
            'appointment'
        )
        .where('doctor_id = :doctorId', {doctorId : doctor_id})
        .andWhere('appointment.appointmentDate = :date', {date: appointmentDate})
        .andWhere('appointment.appointmentTime = :time', {time: appointmentTime}).getOne();
        // console.log(doctorAppointments);
        if (doctorAppointments && doctorAppointments.appointments.length >= 3) throw Error('Three appointments are booked at this time already');
        const newAppointment =  Appointment.create({
            patientFirstName, 
            patientLastName, 
            appointmentDate,
            appointmentTime,
            appointmentType,
            doctor
        });
        await validate(newAppointment);
        await newAppointment.save();
        return newAppointment;
    }

    //removes an appointment after checking for the validity of a doctor id, whether the appointment belongs to a doctor or not and then delete if it does
    async remove(request: Request, response: Response, next: NextFunction) {

        const {id, appointmentId} = request.params;
        const doctor = await Doctor.findOne(id);
        if (!doctor) throw Error(`Doctor with id ${id} does not exist`);
        // //check if this appointment belongs to this Doctor
        const doctorAppointments = await createQueryBuilder(
            'doctor'
        )
        .select('doctor')
        .from(Doctor, 'doctor')
        .leftJoinAndSelect(
            'doctor.appointments',
            'appointment'
        )
        .where('doctor_id = :doctorId', {doctorId : id})
        .andWhere('appointment.id = :id', {id: appointmentId}).getOne();
        if (!doctorAppointments){
            throw Error("This appointment does not belong to this doctor");
        }
        const appointmentToRemove = await this.appointmentRepository
                                              .createQueryBuilder()
                                              .delete()
                                              .from(Appointment)
                                              .where("id = :id", {id: appointmentId})
                                              .execute();
        return appointmentToRemove;
    }

    async update(request: Request, response: Response, next: NextFunction){
        const {id} = request.params;
        let updateObject = {};
        if (request.body.appointmentDate){
            updateObject["appointmentDate"] = request.body.appointmentDate;
        }
        const validTimes = ['00', '15', '30', '45'];
        if(request.body.appointmentTime){
            if (!validTimes.includes(request.body.appointmentTime.substring(3,5))) throw Error('Invalid appointment time');
            updateObject["appointmentTime"] = request.body.appointmentTime;
        }
        if(request.body.appointmentType){
            updateObject["appointmentType"] = request.body.appointmentType;
        }
        await this.appointmentRepository
                  .createQueryBuilder()
                  .update(Appointment)
                  .set(updateObject)
                  .where("id = :appointmentId", {appointmentId: id})
                  .execute();
        const updatedAppointment = Appointment.findOne(id);
        if (!updatedAppointment) {
            return {"message" : "No appointment with that id"}
        };
        return updatedAppointment;
    }

}
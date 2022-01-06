import {Entity, PrimaryGeneratedColumn, Column, Timestamp, ManyToOne, JoinColumn,BaseEntity} from "typeorm";
import { IsDate, IsMilitaryTime } from "class-validator";
import { Doctor } from "./Doctor";

export enum AppointmentType{
    NEW_PATIENT = "New Patient",
    FOLLOW_UP = "Follow Up"
}

@Entity()
export class Appointment extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    // @Column(()=> Name)
    // name: Name

    @Column({type: "varchar", length: 50})
    patientFirstName: string;

    @Column({type: "varchar", length: 50})
    patientLastName: string;
    
    @Column({type: 'date'})
    @IsDate()
    appointmentDate: string

    @Column({type: 'time'})
    appointmentTime: string

    @Column({
        type: 'enum',
        enum: AppointmentType,
        default: AppointmentType.NEW_PATIENT,
                
    })
    appointmentType: AppointmentType

    @ManyToOne(()=>Doctor, 
                (doctor) => doctor.appointments,
                {   
                    orphanedRowAction: 'delete'
                    
                })
    @JoinColumn({name: 'doctor_id'})
    doctor: Doctor

}
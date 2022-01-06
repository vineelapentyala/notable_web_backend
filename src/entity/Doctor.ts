import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { Appointment} from "./Appointment";

@Entity()
export class Doctor extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(
        () => Appointment, 
        (appointment) => appointment.doctor,
        {
            cascade : true
        }
    )
    appointments: Appointment[]

}

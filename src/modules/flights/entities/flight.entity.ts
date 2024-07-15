import { Booking } from 'src/modules/bookings/entities/booking.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm'; 

@Entity('flights')
export class Flight {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Booking, (booking) => booking.flight) // note: we will create author property in the Photo class below
    bookings: Booking[]

    @Column({
        nullable: true,
    })
    destination: String;

    @Column({
        nullable: true,
    })
    departure: String;

    @CreateDateColumn({
    nullable: true
    })
    created_at: Date;

    @UpdateDateColumn({
    nullable: true
    })
    updated_at: Date;

    @DeleteDateColumn({
    nullable: true
    })
    deleted_at: Date;
    
}

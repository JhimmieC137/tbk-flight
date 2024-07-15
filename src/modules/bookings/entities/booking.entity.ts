import { Flight } from "src/modules/flights/entities/flight.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Flight, (flight) => flight.bookings)
    flight: Flight

    @Column({
        nullable: true,
    })
    user_id: String;

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

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'; 

@Entity('flights')
export class Flight {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({
    //     nullable: false,
    // })
    // airway_id: String;

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

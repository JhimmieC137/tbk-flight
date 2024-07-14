import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'; 

@Entity('hotels')
export class Hotel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    name: String;

    @Column({
        nullable: true,
    })
    address: String;

    @Column({
        nullable: false,
        default: true,
    })
    is_active: boolean;

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

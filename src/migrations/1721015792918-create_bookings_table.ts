import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingsTable1721015792918 implements MigrationInterface {
    name = 'CreateBookingsTable1721015792918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "flightId" uuid, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token_blacklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3e37528d03f0bd5335874afa48d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_8e34040f209418864d80f64d5fa" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_8e34040f209418864d80f64d5fa"`);
        await queryRunner.query(`DROP TABLE "token_blacklist"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
    }

}

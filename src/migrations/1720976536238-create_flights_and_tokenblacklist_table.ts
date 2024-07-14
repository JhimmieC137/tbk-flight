import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFlightsAndTokenblacklistTable1720976536238 implements MigrationInterface {
    name = 'CreateFlightsAndTokenblacklistTable1720976536238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flights" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "destination" character varying, "departure" character varying, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c614ef3382fdd70b6d6c2c8d8dd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "flights"`);
    }

}

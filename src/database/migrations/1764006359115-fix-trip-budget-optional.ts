import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTripBudgetOptional1764006359115 implements MigrationInterface {
    name = 'FixTripBudgetOptional1764006359115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "budget" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "budget" integer NOT NULL`);
    }

}

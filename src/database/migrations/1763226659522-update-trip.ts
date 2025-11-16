import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrip1763226659522 implements MigrationInterface {
    name = 'UpdateTrip1763226659522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" ADD "budget" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "budget"`);
    }

}

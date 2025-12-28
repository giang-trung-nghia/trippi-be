import { MigrationInterface, QueryRunner } from "typeorm";

export class GeoUpdateEstimateCost1766936838162 implements MigrationInterface {
    name = 'GeoUpdateEstimateCost1766936838162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "geo" ADD "estimated_cost" integer`);
        await queryRunner.query(`ALTER TABLE "trip_items" ADD "estimated_cost" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_items" DROP COLUMN "estimated_cost"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP COLUMN "estimated_cost"`);
    }

}

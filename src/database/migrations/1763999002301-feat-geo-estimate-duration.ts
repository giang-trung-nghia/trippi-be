import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatGeoEstimateDuration1763999002301 implements MigrationInterface {
    name = 'FeatGeoEstimateDuration1763999002301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "geo" ADD "min_duration_minutes" integer`);
        await queryRunner.query(`ALTER TABLE "geo" ADD "max_duration_minutes" integer`);
        await queryRunner.query(`ALTER TABLE "trip_items" ADD "duration_minutes" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_items" DROP COLUMN "duration_minutes"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP COLUMN "max_duration_minutes"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP COLUMN "min_duration_minutes"`);
    }

}

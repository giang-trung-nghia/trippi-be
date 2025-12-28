import { MigrationInterface, QueryRunner } from "typeorm";

export class TripItemCustomName1766933210876 implements MigrationInterface {
    name = 'TripItemCustomName1766933210876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_items" ADD "custom_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_items" DROP COLUMN "custom_name"`);
    }

}

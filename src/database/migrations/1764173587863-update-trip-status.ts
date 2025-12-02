import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTripStatus1764173587863 implements MigrationInterface {
    name = 'UpdateTripStatus1764173587863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."trips_status_enum" AS ENUM('PLANNING', 'ONGOING', 'COMPLETE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "status" "public"."trips_status_enum" NOT NULL DEFAULT 'PLANNING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."trips_status_enum"`);
    }

}

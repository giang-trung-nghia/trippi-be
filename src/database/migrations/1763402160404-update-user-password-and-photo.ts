import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPasswordAndPhoto1763402160404 implements MigrationInterface {
    name = 'UpdateUserPasswordAndPhoto1763402160404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "photo_url" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photo_url"`);
    }

}

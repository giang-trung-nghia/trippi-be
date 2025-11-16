import { MigrationInterface, QueryRunner } from "typeorm";

export class JwtToken1763313358782 implements MigrationInterface {
    name = 'JwtToken1763313358782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "auth_provider" DROP CONSTRAINT "UQ_19127bdaa3f51cb2c7c4fe7f51b"`);
        await queryRunner.query(`ALTER TABLE "auth_provider" DROP COLUMN "provider"`);
        await queryRunner.query(`CREATE TYPE "public"."auth_provider_provider_enum" AS ENUM('google', 'facebook', 'email')`);
        await queryRunner.query(`ALTER TABLE "auth_provider" ADD "provider" "public"."auth_provider_provider_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_provider" DROP COLUMN "provider"`);
        await queryRunner.query(`DROP TYPE "public"."auth_provider_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "auth_provider" ADD "provider" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth_provider" ADD CONSTRAINT "UQ_19127bdaa3f51cb2c7c4fe7f51b" UNIQUE ("provider")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
    }

}

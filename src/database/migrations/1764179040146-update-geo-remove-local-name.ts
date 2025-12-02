import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGeoRemoveLocalName1764179040146 implements MigrationInterface {
    name = 'UpdateGeoRemoveLocalName1764179040146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "geo_type" DROP COLUMN "display_name_vn"`);
        await queryRunner.query(`ALTER TABLE "geo_type" DROP COLUMN "display_name_en"`);
        await queryRunner.query(`ALTER TABLE "geo_type" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "geo_type" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "geo_type" ADD "display_name_en" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "geo_type" ADD "display_name_vn" character varying NOT NULL`);
    }

}

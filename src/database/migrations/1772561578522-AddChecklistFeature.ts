import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChecklistFeature1772561578522 implements MigrationInterface {
    name = 'AddChecklistFeature1772561578522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "checklist_template_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "order_index" integer NOT NULL, "checklist_template_id" uuid, CONSTRAINT "UQ_2eda693218170a1894ea1143f17" UNIQUE ("checklist_template_id", "order_index"), CONSTRAINT "PK_27f7e6351f6748a0c3053d4b97a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."checklist_templates_type_enum" AS ENUM('PACKING', 'DOCUMENT', 'FOOD', 'EQUIPMENT', 'BABY', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "checklist_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "type" "public"."checklist_templates_type_enum" NOT NULL, CONSTRAINT "PK_e6d17651d110bbac45cf07e44fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checklist_user_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "order_index" integer NOT NULL, "checklist_user_id" uuid, CONSTRAINT "UQ_0b595498d5964977447890a2ef9" UNIQUE ("checklist_user_id", "order_index"), CONSTRAINT "PK_ec0ce81ff04f367dcc70d81f43e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checklist_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "user_id" uuid, "template_id" uuid, CONSTRAINT "PK_32b93e02ca6c04c34874988153e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checklist_trip_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "order_index" integer NOT NULL, "is_checked" boolean NOT NULL DEFAULT false, "checked_at" TIMESTAMP, "checklist_trip_id" uuid, "checked_by_id" uuid, CONSTRAINT "UQ_40ff79af3929939e7e3468f661e" UNIQUE ("checklist_trip_id", "order_index"), CONSTRAINT "PK_a7a508c6be83489c5de761742fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checklist_trips" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "trip_id" uuid, "checklist_user_id" uuid, CONSTRAINT "PK_febc07669e1c3d5090b9ced2188" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "checklist_template_items" ADD CONSTRAINT "FK_580b29b0fc0aaed8da3957ef8f4" FOREIGN KEY ("checklist_template_id") REFERENCES "checklist_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_user_items" ADD CONSTRAINT "FK_1916131219b5b785632ceb68e5f" FOREIGN KEY ("checklist_user_id") REFERENCES "checklist_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_users" ADD CONSTRAINT "FK_10e2e822441b813fc2e7cd64339" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_users" ADD CONSTRAINT "FK_74c8e31dc3e1df5d0178eb5ecc1" FOREIGN KEY ("template_id") REFERENCES "checklist_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_trip_items" ADD CONSTRAINT "FK_9eb329bbe26aaa10ec4515ac429" FOREIGN KEY ("checklist_trip_id") REFERENCES "checklist_trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_trip_items" ADD CONSTRAINT "FK_26d6b98d8c53a2610aaeaa9aed6" FOREIGN KEY ("checked_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_trips" ADD CONSTRAINT "FK_2e8bb13c2acdf538d0ed20efd35" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklist_trips" ADD CONSTRAINT "FK_3fc840debb3cd8210dc14e4ac19" FOREIGN KEY ("checklist_user_id") REFERENCES "checklist_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checklist_trips" DROP CONSTRAINT "FK_3fc840debb3cd8210dc14e4ac19"`);
        await queryRunner.query(`ALTER TABLE "checklist_trips" DROP CONSTRAINT "FK_2e8bb13c2acdf538d0ed20efd35"`);
        await queryRunner.query(`ALTER TABLE "checklist_trip_items" DROP CONSTRAINT "FK_26d6b98d8c53a2610aaeaa9aed6"`);
        await queryRunner.query(`ALTER TABLE "checklist_trip_items" DROP CONSTRAINT "FK_9eb329bbe26aaa10ec4515ac429"`);
        await queryRunner.query(`ALTER TABLE "checklist_users" DROP CONSTRAINT "FK_74c8e31dc3e1df5d0178eb5ecc1"`);
        await queryRunner.query(`ALTER TABLE "checklist_users" DROP CONSTRAINT "FK_10e2e822441b813fc2e7cd64339"`);
        await queryRunner.query(`ALTER TABLE "checklist_user_items" DROP CONSTRAINT "FK_1916131219b5b785632ceb68e5f"`);
        await queryRunner.query(`ALTER TABLE "checklist_template_items" DROP CONSTRAINT "FK_580b29b0fc0aaed8da3957ef8f4"`);
        await queryRunner.query(`DROP TABLE "checklist_trips"`);
        await queryRunner.query(`DROP TABLE "checklist_trip_items"`);
        await queryRunner.query(`DROP TABLE "checklist_users"`);
        await queryRunner.query(`DROP TABLE "checklist_user_items"`);
        await queryRunner.query(`DROP TABLE "checklist_templates"`);
        await queryRunner.query(`DROP TYPE "public"."checklist_templates_type_enum"`);
        await queryRunner.query(`DROP TABLE "checklist_template_items"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTripGeoAuth1763309206748 implements MigrationInterface {
    name = 'CreateUserTripGeoAuth1763309206748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "geo_type" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "google_type" character varying NOT NULL, "display_name_en" character varying NOT NULL, "display_name_vn" character varying NOT NULL, CONSTRAINT "UQ_51bb05cf2e0fd804fc868326641" UNIQUE ("google_type"), CONSTRAINT "PK_acfd8641324e1fe6abc0b6ca021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geo" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "address" character varying, "lat" numeric(10,7) NOT NULL, "lng" numeric(10,7) NOT NULL, "google_place_id" character varying, "geo_type_id" uuid, "parent_id" uuid, CONSTRAINT "PK_56e32047948967e75e3d980c9c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "day" date NOT NULL, "start_time" TIME, "end_time" TIME, "note" text, "custom_name" character varying, "geo_id" uuid, "trip_id" uuid, CONSTRAINT "PK_515a9607ae33d4536f40d60f85e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "budget" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_provider" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider" character varying NOT NULL, "provider_user_id" character varying, "email" character varying NOT NULL, "password_hash" character varying, "user_id" uuid, CONSTRAINT "UQ_19127bdaa3f51cb2c7c4fe7f51b" UNIQUE ("provider"), CONSTRAINT "UQ_1b59f1dc839a47bdb2aac8f5460" UNIQUE ("provider_user_id"), CONSTRAINT "PK_0a6e6348fe38ba49160eb903c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'staff', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_a1de6596813b69a89200b1e9d24" FOREIGN KEY ("geo_type_id") REFERENCES "geo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_26429a5c4b06288dc761b0cda20" FOREIGN KEY ("parent_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_1b6259f8270b99db1a9a990cf61" FOREIGN KEY ("geo_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_433ae9d7c77037ea30135414c29" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_c32589af53db811884889e03663" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_provider" ADD CONSTRAINT "FK_b258701252799b59135e88cc953" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_provider" DROP CONSTRAINT "FK_b258701252799b59135e88cc953"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_c32589af53db811884889e03663"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_433ae9d7c77037ea30135414c29"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_1b6259f8270b99db1a9a990cf61"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_26429a5c4b06288dc761b0cda20"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_a1de6596813b69a89200b1e9d24"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "auth_provider"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
        await queryRunner.query(`DROP TABLE "geo"`);
        await queryRunner.query(`DROP TABLE "geo_type"`);
    }

}

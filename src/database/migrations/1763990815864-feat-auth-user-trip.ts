import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatAuthUserTrip1763990815864 implements MigrationInterface {
    name = 'FeatAuthUserTrip1763990815864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."trip_members_role_enum" AS ENUM('OWNER', 'EDITOR', 'VIEWER')`);
        await queryRunner.query(`CREATE TABLE "trip_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role" "public"."trip_members_role_enum" NOT NULL, "trip_id" uuid, "user_id" uuid, CONSTRAINT "UQ_9f2ed7f6cebbb601b66d2847e6e" UNIQUE ("trip_id", "user_id"), CONSTRAINT "PK_d0368bd704fcb6883af326d8285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geo_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "google_type" character varying NOT NULL, "display_name_en" character varying NOT NULL, "display_name_vn" character varying NOT NULL, CONSTRAINT "UQ_51bb05cf2e0fd804fc868326641" UNIQUE ("google_type"), CONSTRAINT "PK_acfd8641324e1fe6abc0b6ca021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geo_photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "photo_url" character varying NOT NULL, "geo_id" uuid, CONSTRAINT "PK_c05b7556c6b17d0432b9a83901a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "address" character varying, "lat" numeric(10,7) NOT NULL, "lng" numeric(10,7) NOT NULL, "google_place_id" character varying, "rating" integer, "phone" character varying, "website" character varying, "standard_opening_hours" TIMESTAMP, "standard_closing_hours" TIMESTAMP, "geo_type_id" uuid, "parent_id" uuid, CONSTRAINT "PK_56e32047948967e75e3d980c9c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."trip_items_type_enum" AS ENUM('PLACE', 'NOTE', 'TRANSPORT', 'MEAL', 'HOTEL', 'ACTIVITY')`);
        await queryRunner.query(`CREATE TABLE "trip_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."trip_items_type_enum" NOT NULL, "snapshot" json NOT NULL, "start_time" TIME, "end_time" TIME, "cost" double precision, "note" text, "order_index" integer NOT NULL, "trip_day_id" uuid, "geo_id" uuid, CONSTRAINT "UQ_4f13220ee08cc1cfe094f0c192c" UNIQUE ("trip_day_id", "order_index"), CONSTRAINT "PK_cb152648a565f8382cb4f8b179f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trip_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "day_index" integer NOT NULL, "date" TIMESTAMP NOT NULL, "note" character varying, "trip_id" uuid, CONSTRAINT "UQ_9c499d8d50fe6f00d47e65afab8" UNIQUE ("trip_id", "day_index"), CONSTRAINT "PK_050b16d50cf830df078e0ad0efb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "budget" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "is_public" boolean NOT NULL DEFAULT false, "cover_image_url" character varying, "user_id" uuid, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."auth_provider_provider_enum" AS ENUM('GOOGLE', 'FACEBOOK', 'EMAIL')`);
        await queryRunner.query(`CREATE TABLE "auth_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider" "public"."auth_provider_provider_enum" NOT NULL, "provider_user_id" character varying, "email" character varying NOT NULL, "password_hash" character varying, "user_id" uuid, CONSTRAINT "UQ_1b59f1dc839a47bdb2aac8f5460" UNIQUE ("provider_user_id"), CONSTRAINT "PK_0a6e6348fe38ba49160eb903c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'STAFF', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying, "photo_url" character varying, "refresh_token" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trip_members" ADD CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_members" ADD CONSTRAINT "FK_f5221f69b9fa76f6ac5396f030d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geo_photo" ADD CONSTRAINT "FK_ad97dde591747c7687b78bec5e0" FOREIGN KEY ("geo_id") REFERENCES "geo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_a1de6596813b69a89200b1e9d24" FOREIGN KEY ("geo_type_id") REFERENCES "geo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_26429a5c4b06288dc761b0cda20" FOREIGN KEY ("parent_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_items" ADD CONSTRAINT "FK_fcd3bd3bbc3a0968f0f7ba9e823" FOREIGN KEY ("trip_day_id") REFERENCES "trip_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_items" ADD CONSTRAINT "FK_6ab55c0639f667ddd53192cdd91" FOREIGN KEY ("geo_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trip_days" ADD CONSTRAINT "FK_45782e783a4f545fbf2a2fa181c" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_c32589af53db811884889e03663" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_provider" ADD CONSTRAINT "FK_b258701252799b59135e88cc953" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_provider" DROP CONSTRAINT "FK_b258701252799b59135e88cc953"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_c32589af53db811884889e03663"`);
        await queryRunner.query(`ALTER TABLE "trip_days" DROP CONSTRAINT "FK_45782e783a4f545fbf2a2fa181c"`);
        await queryRunner.query(`ALTER TABLE "trip_items" DROP CONSTRAINT "FK_6ab55c0639f667ddd53192cdd91"`);
        await queryRunner.query(`ALTER TABLE "trip_items" DROP CONSTRAINT "FK_fcd3bd3bbc3a0968f0f7ba9e823"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_26429a5c4b06288dc761b0cda20"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_a1de6596813b69a89200b1e9d24"`);
        await queryRunner.query(`ALTER TABLE "geo_photo" DROP CONSTRAINT "FK_ad97dde591747c7687b78bec5e0"`);
        await queryRunner.query(`ALTER TABLE "trip_members" DROP CONSTRAINT "FK_f5221f69b9fa76f6ac5396f030d"`);
        await queryRunner.query(`ALTER TABLE "trip_members" DROP CONSTRAINT "FK_2bc25d7b7dd3984a649d49bb9a7"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "auth_provider"`);
        await queryRunner.query(`DROP TYPE "public"."auth_provider_provider_enum"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TABLE "trip_days"`);
        await queryRunner.query(`DROP TABLE "trip_items"`);
        await queryRunner.query(`DROP TYPE "public"."trip_items_type_enum"`);
        await queryRunner.query(`DROP TABLE "geo"`);
        await queryRunner.query(`DROP TABLE "geo_photo"`);
        await queryRunner.query(`DROP TABLE "geo_type"`);
        await queryRunner.query(`DROP TABLE "trip_members"`);
        await queryRunner.query(`DROP TYPE "public"."trip_members_role_enum"`);
    }

}

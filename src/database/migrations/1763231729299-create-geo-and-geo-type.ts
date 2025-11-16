import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGeoAndGeoType1763231729299 implements MigrationInterface {
    name = 'CreateGeoAndGeoType1763231729299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_0bd292197ec9748de6058add4dd"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_db768456df45322f8a749534322"`);
        await queryRunner.query(`ALTER TABLE "trips" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`CREATE TABLE "geo_type" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "googleType" character varying NOT NULL, "displayNameEn" character varying NOT NULL, "displayNameVn" character varying NOT NULL, CONSTRAINT "UQ_affd0fb75ff77c0e7037fd7b3ed" UNIQUE ("googleType"), CONSTRAINT "PK_acfd8641324e1fe6abc0b6ca021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geo" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "address" character varying, "lat" numeric(10,7) NOT NULL, "lng" numeric(10,7) NOT NULL, "googlePlaceId" character varying, "geo_type_id" uuid, "parent_id" uuid, CONSTRAINT "PK_56e32047948967e75e3d980c9c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP COLUMN "tripId"`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD "geo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD "trip_id" uuid`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_a1de6596813b69a89200b1e9d24" FOREIGN KEY ("geo_type_id") REFERENCES "geo_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geo" ADD CONSTRAINT "FK_26429a5c4b06288dc761b0cda20" FOREIGN KEY ("parent_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_1b6259f8270b99db1a9a990cf61" FOREIGN KEY ("geo_id") REFERENCES "geo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_433ae9d7c77037ea30135414c29" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_c32589af53db811884889e03663" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_c32589af53db811884889e03663"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_433ae9d7c77037ea30135414c29"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_1b6259f8270b99db1a9a990cf61"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_26429a5c4b06288dc761b0cda20"`);
        await queryRunner.query(`ALTER TABLE "geo" DROP CONSTRAINT "FK_a1de6596813b69a89200b1e9d24"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP COLUMN "trip_id"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP COLUMN "geo_id"`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD "tripId" uuid`);
        await queryRunner.query(`DROP TABLE "geo"`);
        await queryRunner.query(`DROP TABLE "geo_type"`);
        await queryRunner.query(`ALTER TABLE "trips" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_0bd292197ec9748de6058add4dd" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

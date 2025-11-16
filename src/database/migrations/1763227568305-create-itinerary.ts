import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateItinerary1763227568305 implements MigrationInterface {
    name = 'CreateItinerary1763227568305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "day" date NOT NULL, "startTime" TIME, "endTime" TIME, "note" text, "customName" character varying, "tripId" uuid, CONSTRAINT "PK_515a9607ae33d4536f40d60f85e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trips" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_0bd292197ec9748de6058add4dd" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_db768456df45322f8a749534322"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_0bd292197ec9748de6058add4dd"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1690696364287 implements MigrationInterface {
    name = 'Migrate1690696364287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "totalCell"`);
        await queryRunner.query(`ALTER TABLE "block" ADD "named" character varying`);
        await queryRunner.query(`ALTER TABLE "block" ADD "totalCells" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "totalCells"`);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "named"`);
        await queryRunner.query(`ALTER TABLE "block" ADD "totalCell" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "block" ADD "name" character varying NOT NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1690486133191 implements MigrationInterface {
    name = 'Migrate1690486133191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "status"`);
    }

}

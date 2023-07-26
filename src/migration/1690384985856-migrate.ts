import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1690384985856 implements MigrationInterface {
    name = 'Migrate1690384985856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prison" ADD "createdDate" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prison" DROP COLUMN "createdDate"`);
    }

}

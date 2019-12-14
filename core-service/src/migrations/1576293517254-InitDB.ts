import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDB1576293517254 implements MigrationInterface {
    name = 'InitDB1576293517254'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `mail` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `file` varchar(255) NOT NULL, UNIQUE INDEX `IDX_a33780fee5a320eaff8caff4b6` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_a33780fee5a320eaff8caff4b6` ON `mail`", undefined);
        await queryRunner.query("DROP TABLE `mail`", undefined);
    }

}

// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class AddRolesToUser1779243357664 implements MigrationInterface {
//   name = 'AddRolesToUser1779243357664';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE \`users\` ADD \`roles\` varchar(255) NOT NULL DEFAULT 'user'`,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roles\``);
//   }
// }

// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class AddTableTokens1775190523615 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'tokens',
//         columns: [
//           {
//             name: 'id',
//             type: 'varchar',
//             length: '36',
//             isGenerated: true,
//             generationStrategy: 'uuid',
//             isPrimary: true,
//           },
//           {
//             name: 'refreshToken',
//             type: 'varchar',
//             length: '255',
//           },
//           {
//             name: 'refreshPublicKey',
//             type: 'varchar',
//             length: '255',
//           },
//           { name: 'accessPublicKey', type: 'varchar', length: '255' },
//           {
//             name: 'userId',
//             type: 'varchar',
//             length: '36',
//           },
//           {
//             name: 'expiresAt',
//             type: 'timestamp',
//           },
//           {
//             name: 'createdAt',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'updatedAt',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//             onUpdate: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'deletedAt',
//             type: 'timestamp',
//             isNullable: true,
//           },
//         ],
//         foreignKeys: [
//           {
//             columnNames: ['userId'],
//             referencedTableName: 'users',
//             referencedColumnNames: ['id'],
//             onDelete: 'CASCADE',
//           },
//         ],
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('tokens');
//   }
// }

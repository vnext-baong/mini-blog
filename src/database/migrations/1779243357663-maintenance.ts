// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class Maintenance1779243357663 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'maintenanceIp',
//         columns: [
//           {
//             name: 'id',
//             type: 'int',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'increment',
//           },
//           {
//             name: 'ip',
//             type: 'varchar',
//             isUnique: true,
//           },
//           { name: 'description', type: 'varchar', isNullable: true },
//         ],
//       }),
//     );
//     await queryRunner.createTable(
//       new Table({
//         name: 'maintenanceUser',
//         columns: [
//           {
//             name: 'id',
//             type: 'int',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'increment',
//           },
//           {
//             name: 'userId',
//             type: 'varchar',
//             isUnique: true,
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
//     await queryRunner.createTable(
//       new Table({
//         name: 'maintenanceConfig',
//         columns: [
//           {
//             name: 'id',
//             type: 'int',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'increment',
//           },
//           {
//             name: 'isActive',
//             type: 'boolean',
//             default: false,
//           },
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {}
// }

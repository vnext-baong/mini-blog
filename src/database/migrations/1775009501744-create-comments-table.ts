// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class CreateCommentsTable1775009501744 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'comments',
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
//             name: 'content',
//             type: 'text',
//           },
//           {
//             name: 'postId',
//             type: 'varchar',
//             length: '36',
//           },
//           {
//             name: 'authorId',
//             type: 'varchar',
//             length: '36',
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
//             columnNames: ['postId'],
//             referencedTableName: 'posts',
//             referencedColumnNames: ['id'],
//             onDelete: 'CASCADE',
//           },
//           {
//             columnNames: ['userId'],
//             referencedTableName: 'users',
//             referencedColumnNames: ['id'],
//             onDelete: 'CASCADE',
//           },
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('comments');
//   }
// }

// import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// export class AddThumbnailToPostsTable1775200000000 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.addColumn(
//       'posts',
//       new TableColumn({
//         name: 'thumbnail',
//         type: 'varchar',
//         isNullable: true,
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('posts', 'thumbnail');
//   }
// }

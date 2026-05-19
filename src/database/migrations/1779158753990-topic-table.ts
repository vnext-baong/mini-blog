import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class TopicTable1779158753990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'topics',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'topic_id',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['topic_id'],
        referencedTableName: 'topics',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('posts');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('topic_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('posts', foreignKey);
    }
    await queryRunner.dropColumn('posts', 'topic_id');
    await queryRunner.dropTable('topics');
  }
}

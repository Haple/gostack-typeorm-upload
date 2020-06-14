import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryIdToTransactions1592171550317
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'FK_TransactionsCategories',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.dropForeignKey('transactions', 'FK_TransactionsCategories');
    queryRunner.dropColumn('transactions', 'category_id');
  }
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSurveyUsers1614287617920 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "surveys_users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true

          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "survey_id",
            type: "uuid"
          },
          {
            name: "value",
            type: "number",
            isNullable: true
          },
          {
            name: "created_at",
            type: "timestemp",
            default: "now()"
          },
        ],
        foreignKeys: [
          {
            name: "FKuser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          },
          {
            name: "FKsurvey",
            referencedTableName: "surveys",
            referencedColumnNames: ["id"],
            columnNames: ["survey_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("surveys_users")
  }

}

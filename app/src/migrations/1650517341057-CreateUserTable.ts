import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1650517341057 implements MigrationInterface {
  name = 'CreateUserTable1650517341057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
        id varchar(255) NOT NULL, 
        name varchar(30) NOT NULL, 
        email varchar(60) NOT NULL, 
        password varchar(30) NOT NULL, 
        signupVerifyToken varchar(60) NOT NULL, 
        isRegistered tinyint(1) DEFAULT 0 NOT NULL,
        
        PRIMARY KEY (id)
    ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}

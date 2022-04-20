/**
 * logging 옵션
 *
 * query - 모든 쿼리를 기록합니다.
 * error - 실패한 모든 쿼리 및 오류를 기록합니다.
 * schema - 스키마 빌드 프로세스를 기록합니다.
 * warn - 내부의 orm 경고를 기록합니다.
 * info - 내부의 유용한 orm 메시지를 기록합니다.
 * log - 내부의 orm 로그 메시지를 기록합니다.
 */

/**
 * logger 옵션
 *
 * advanced-console - color와 SQL syntax-highlighting을 표시(chalk 사용)하여 모든 메시지를 콘솔에 기록하는 Dafult logger입니다).
 * simple-console - advanced-console logger와 동일하지만 syntax-highlighting 표시를 사용하지 않는 simple-console logger입니다. 이 로거는 문제가 있거나 색상이 지정된 로그를 좋아하지 않을 때 사용할 수 있습니다.
 * file - 이 로거는 프로젝트의 루트 폴더(package.json 근처)에 있는 ormlogs.log에 모든 로그를 기록합니다.
 * debug - 이 로거는 디버그 패키지를 사용하여 env 변수 DEBUG=typeorm:*을(를) 설정합니다. (참고로 로깅 옵션은 이 로거에 영향을 미치지 않습니다.)
 */

/**
 * Migrations NPM 명령
 *
 * npm run typeorm migration:generate -- -n CreateUserTable
 * generate: 엔티티 파일들을 분석해서 자동으로 마이그레이션 파일을 만들어줍니다.
 * -n: 마이그레이션 파일의 이름을 등록하기 위한 옵션
 * CreateUserTable: 마이그레이션 파일의 이름
 */

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin!',
  database: process.env.DB_DATABASE || 'oop_traning',
  entities: [`dist/**/*.entity{.ts,.js}`],
  synchronize: false, // migrations의 원활한 동작을 위해 false로 설정 // Boolean(process.env.DB_SYNC),
  logger: 'advanced-console', // 로그 기록 방식
  logging: ['query'], // 어떤 것을 로그로 남길 것인지 ('all', ['error', 'info'] 등으로 세세하게 제어 가능)
  migrations: ['dist/src/migrations/*{.ts,.js}'], // 마이그레이션을 수행할 파일
  cli: {
    migrationsDir: 'src/migrations', // 마이그레이션 파일을 생성할 디렉토리.
  },
  migrationsTableName: 'migrations', // 마이그레이션 이력이 기록되는 테이블 이름. 생략할 경우 기본값은 migrations 입니다.
};

import * as uuid from 'uuid';
import { ConflictException, Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly connection: Connection,
    private emailService: EmailService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();

    const isExistedUser = await this.checkUserExists(email);
    if (isExistedUser)
      // 책에서는 UnprocessableEntityException 에러를 throw하여 422 에러코드를 응답하였음
      throw new ConflictException('이미 존재하는 이메일입니다.'); // statusCode: 409

    const signupVerifyToken = uuid.v1();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      this.usersRepository = queryRunner.manager.getRepository(UserEntity);

      await this.saveUser(name, email, password, signupVerifyToken);

      // throw new Error('트랜잭션 정상 동작 확인을 위한 고의적인 에러 발생');

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
      throw new Error(
        '회원가입 트랜잭션 수행 중 오류가 발생하여 롤백 되었습니다. 인증용 이메일은 전송되지 않습니다.',
      );
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
    await this.sendMemberJoinEmail(email, signupVerifyToken);
    console.log('Created User', name, email, password);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급

    throw new Error('Method not implemented.');
  }

  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급

    throw new Error('Method not implemented.');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented.');
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    return !!user;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

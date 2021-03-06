import * as uuid from 'uuid';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly connection: Connection,
    private emailService: EmailService,
    private authService: AuthService,
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

      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.getRepository(UserEntity).save(user);

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
    const queryRunner = this.connection.createQueryRunner();
    const user = await this.usersRepository.findOne({ signupVerifyToken });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    if (user.isRegistered)
      throw new BadRequestException('이미 회원가입된 사용자입니다.');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      user.isRegistered = 1;

      await queryRunner.manager.getRepository(UserEntity).save(user);

      // throw new Error('트랜잭션 정상 동작 확인을 위한 고의적인 에러 발생');

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
      throw new Error(
        'isRegistered를 1로 업데이트하는 트랜잭션 수행 중 오류가 발생하여 롤백 되었습니다. 인증용 이메일은 전송되지 않습니다.',
      );
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }

    return this.authService.createJwt({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email, password });

    if (!user) throw new NotFoundException('유저가 존재하지 않습니다');

    return this.authService.createJwt({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    return !!user;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

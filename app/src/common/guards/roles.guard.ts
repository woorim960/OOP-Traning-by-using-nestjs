import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
// 권한 허가를 위한 인가 가드
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // user.id에 해당하는 권한 가져오기
    const userRole = this.getUserRole(user.id);

    // roles 메타데이터의 값 가져오기
    // roles.decorator.ts의 SetMetadata()로 런타임 때 설정된 roles 값들을 가져오는 것임.
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(), // @Roles() 를 메서드에 사용했을 때 사용됨
      context.getClass(), // @Roles() 를 클래스(ex: UserController)에 사용했을 때 사용됨
    ]);

    // roles 라는 메타데이터가 설정되어있지 않다면 true를 리턴하여 모든 권한에서 실행가능하도록 함
    // roles가 있으면 user.id에 해당하는 권한이 roles에 존재하면 true를 리턴함.
    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    // 무조건 'admin'을 반환함.
    // 실제 기능 구현 시 DB에 userId 로우를 가져와서 role에 속성 값을 반환하는 등의 행동을 하도록 수정해야함.
    return 'admin';
  }
}

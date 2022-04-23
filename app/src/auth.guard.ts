import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    // Authorization 헤더 값의 JWT 부분만 가져오기 위해 'Bearer '를 잘라낸다.
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    // JWT가 올바른지 검증하고, 잘못됐다면 에러 발생 후 Unauthrized 401 상태코드 응답
    this.authService.verify(jwtString);

    return true;
  }
}

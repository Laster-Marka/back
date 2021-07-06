import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy';
import { jwtConstants } from '../constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate{
  constructor(
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    if(!req.headers.authorization){
      return false
    }
    req.user = await this.validateToken(req.headers.authorization)
    console.log("validate token response: " + req.user)
    return true
  }
  async validateToken(auth: string) {
    if(auth.split(' ')[0] !== 'Bearer'){
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN)
    } const token = auth.split(' ')[1];
    try{
      const decoded = await this.jwtService.verify(token)

      return decoded
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name)
      throw new HttpException(message, HttpStatus.FORBIDDEN)
    }
  }
}

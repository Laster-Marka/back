import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';
import { IUser } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<IUser | null> {
    const user = await this.userService.getByEmail(username)
    console.log(user)
    if (!user) {
      return null
    }
    const match = await user.comparePassword(pass)
    if (!match) {
      return null
    }
    const { password, ...result } = user
    return user
  }

  async login(user: IUser) {
    const payload = { name: user.name, password: user.password }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDTO) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { useremail: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

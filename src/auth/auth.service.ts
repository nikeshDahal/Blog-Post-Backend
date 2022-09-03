import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async validateUser(inputDatas: LoginInput) {
    const [user] = await this.userService.findByEmail(inputDatas.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const validPassword = compareSync(inputDatas.password, user.password)
    if(!validPassword){
        throw new UnauthorizedException("Given password is incorrect ")
    }
    return {
      user,
    };
  }
}

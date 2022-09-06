import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService : JwtService
    ) {}
  async validateUser(inputDatas: LoginInput) {
    const [user] = await this.userService.findByEmail(inputDatas.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const validPassword = compareSync(inputDatas.password, user.password)
    if(!validPassword){
        throw new UnauthorizedException("Given password is incorrect ")
    }
   const access_token =await this.generateJwtToken(user);
    return {
      user,
      access_token
    };
  }
  private async generateJwtToken(user:any){
    const payload = {username : user.username , sub:user._id};
    return await this.jwtService.signAsync(payload)
  }
}


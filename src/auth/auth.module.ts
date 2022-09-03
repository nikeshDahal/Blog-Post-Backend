import { Module } from '@nestjs/common';

// import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module'
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports :[UsersModule],
  providers: [AuthResolver, AuthService ],
  exports :[AuthService]
})
export class AuthModule {}

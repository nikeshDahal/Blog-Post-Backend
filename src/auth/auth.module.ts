import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module'
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './jwt-auth.guard';
import {JwtStrategy} from './jwt.strategy'

@Module({
  imports :[
    UsersModule,
    JwtModule.register({
      secret: 'JWTSECRETKEY',
      signOptions: {
        expiresIn: '1800s',
      },
    }),

  ],
  providers: [AuthResolver, AuthService , JwtStrategy ],
  exports :[AuthService ]
})
export class AuthModule {}

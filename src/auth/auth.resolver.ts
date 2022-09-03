import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';
import { UserType } from './dto/user.dto';

@Resolver(()=>UserType)
export class AuthResolver {
    constructor(private authService :AuthService){}
    @Query(()=>UserType)
    async login (@Args('loginCredentials') loginCredentials : LoginInput){
        const user= await this.authService.validateUser(loginCredentials);
        console.log("auth resolver :>",user);
        return user
    }
}

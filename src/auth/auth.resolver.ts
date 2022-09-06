import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';
import { UserType } from './dto/user.dto';


@Resolver('Auth')
export class AuthResolver {
    constructor(private authService :AuthService){}
    @Query(()=>UserType)
    async login (@Args('loginCredentials') loginCredentials : LoginInput){
        const {user , access_token}= await this.authService.validateUser(loginCredentials);
        console.log("user logged in sucessfully =>",{user,access_token});
        return {
            user,
            access_token
        }
    }
}

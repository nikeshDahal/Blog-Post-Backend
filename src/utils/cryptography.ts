import { hashSync , compare} from 'bcrypt'

export const  passwordTransformation = {
    to(password : string):string{
        return hashSync(password,10);
    },
    from(password:string , hash:string):Promise<boolean>{
        return compare(password , hash);
    },
};

import { validateRegisterInput } from './../untils/validateRegisterInput';
import { RegisterInput } from '../types/RegisterInput';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { User } from '../entities/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import logger from '../config/logger';

@Resolver()
export class UserResolver {
   @Mutation((_return) => UserMutationResponse)
   async register(
      @Arg('registerInput') registerInput: RegisterInput,
   ): Promise<UserMutationResponse> {
      try {
         const { email, username, password } = registerInput;
         const validateInput = validateRegisterInput(registerInput);
         if (validateInput) return { code: 400, success: false, ...validateInput };

         const existingUser = await User.findOne({
            where: [{ username }, { email }],
         });
         if (existingUser)
            return {
               code: 400,
               success: false,
               message: 'User existed',
               errors: [
                  {
                     field: existingUser.username === username ? 'username' : 'email',
                     message: 'username or email already existed',
                  },
               ],
            };

         const hashPassWord = await argon2.hash(password);

         const newUser = User.create({
            username,
            password: hashPassWord,
            email,
         });

         return {
            code: 200,
            success: true,
            message: 'User existed',
            user: await User.save(newUser),
         };
      } catch (error) {
         logger.error('Registering user failed. ', error.message);
         return {
            code: 500,
            success: false,
            message: error.message,
         };
      }
   }
}
// aaa

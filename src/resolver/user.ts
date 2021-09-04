import { COOKIE_NAME } from './../constants';
import { Context } from './../types/Context';
import { validateRegisterInput } from './../utils/validateRegisterInput';
import { RegisterInput } from '../types/RegisterInput';
import { LoginInput } from '../types/LoginInput';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { User } from '../entities/User';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import logger from '../config/logger';

@Resolver()
export class UserResolver {
   @Mutation((_return) => UserMutationResponse)
   async register(
      @Arg('registerInput') registerInput: RegisterInput,
      @Ctx() { req }: Context,
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

         let newUser = User.create({
            username,
            password: hashPassWord,
            email,
         });

         await newUser.save();
         //Create session
         req.session.userID = newUser.userID;

         return {
            code: 200,
            success: true,
            message: 'User existed',
            user: newUser,
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

   @Mutation((_return) => UserMutationResponse)
   async login(
      @Arg('loginInput') { usernameOrEmail, password }: LoginInput,
      @Ctx() { req }: Context,
   ): Promise<UserMutationResponse> {
      try {
         const IS_EMAIL = usernameOrEmail.includes('@');

         const existingUser = await User.findOne(
            IS_EMAIL ? { email: usernameOrEmail } : { username: usernameOrEmail },
         );
         if (!existingUser)
            return {
               code: 404,
               success: false,
               message: 'User not found',
               errors: [
                  {
                     field: IS_EMAIL ? 'email' : 'username',
                     message: 'username or email already existed',
                  },
               ],
            };

         const isValidPassWord = await argon2.verify(existingUser.password, password);

         if (!isValidPassWord)
            return {
               code: 400,
               success: false,
               message: 'Wrong password',
               errors: [
                  {
                     field: 'password',
                     message: 'Wrong password',
                  },
               ],
            };

         //Create session
         req.session.userID = existingUser.userID;

         return {
            code: 200,
            success: true,
            message: 'Login succeed',
            user: existingUser,
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

   @Mutation((_return) => Boolean)
   logout(@Ctx() { req, res }: Context): Promise<Boolean> {
      return new Promise((resolve, _reject) => {
         res.clearCookie(COOKIE_NAME as string);
         req.session.destroy((error) => {
            if (error) {
               console.log('Destroying session failed.', error.message);
               resolve(false);
            }
            resolve(true);
         });
      });
   }
}

import { User } from '../entities/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import logger from '../config/logger';

@Resolver()
export class UserResolver {
   @Mutation((_return) => User, { nullable: true })
   async register(
      @Arg('email') email: string,
      @Arg('username') username: string,
      @Arg('password') password: string,
   ): Promise<User | null> {
      try {
         const existingUser = await User.findOne({
            where: [{ username }, { email }],
         });
         if (existingUser) return null;

         const hashPassWord = await argon2.hash(password);

         const newUser = User.create({
            username,
            password: hashPassWord,
            email,
         });

         return await User.save(newUser);
      } catch (error) {
         logger.error('Registering user failed. ', error.message);
         return null;
      }
   }
}

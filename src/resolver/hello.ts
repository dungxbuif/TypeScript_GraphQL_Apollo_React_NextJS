import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloWolrdResolver {
   @Query((_return) => String)
   hello() {
      return 'test';
   }
}

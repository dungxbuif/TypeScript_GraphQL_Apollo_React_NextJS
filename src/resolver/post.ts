import { PostMutationResponse } from '../types/PostMutationResponse';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreatePostInput } from '../types/CreatePostInput';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
   @Mutation((_return) => PostMutationResponse)
   async createPost(
      @Arg('createPostInput') { title, text }: CreatePostInput,
   ): Promise<PostMutationResponse> {
      try {
         const newPost = Post.create({ title, text });

         await newPost.save();
      } catch (error) {}
   }
}

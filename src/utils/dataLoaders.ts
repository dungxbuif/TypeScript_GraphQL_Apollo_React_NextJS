import DataLoader from 'dataloader';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';

interface VoteTypeCondition {
   postId: number;
   userID: number;
}

// [1, 2]
// users === [{id: 1}, {id: 2}]
// FALSE: users === [{id: 2}, {id: 1}]
const batchGetUsers = async (userIDs: number[]) => {
   const users = await User.findByIds(userIDs);
   return userIDs.map((userID) => users.find((user) => user.userID === userID));
};

// SELECT * FROM Upvote WHERE [postId, userID] IN ([[19, 1], [18, 1], [17, 1]])

const batchGetVoteTypes = async (voteTypeConditions: VoteTypeCondition[]) => {
   const voteTypes = await Upvote.findByIds(voteTypeConditions);
   return voteTypeConditions.map((voteTypeCondition) =>
      voteTypes.find(
         (voteType) =>
            voteType.postId === voteTypeCondition.postId &&
            voteType.userID === voteTypeCondition.userID,
      ),
   );
};

export const buildDataLoaders = () => ({
   userLoader: new DataLoader<number, User | undefined>((userIDs) =>
      batchGetUsers(userIDs as number[]),
   ),
   voteTypeLoader: new DataLoader<VoteTypeCondition, Upvote | undefined>((voteTypeConditions) =>
      batchGetVoteTypes(voteTypeConditions as VoteTypeCondition[]),
   ),
});

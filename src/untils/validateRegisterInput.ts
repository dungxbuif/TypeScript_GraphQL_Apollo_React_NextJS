import { RegisterInput } from '../types/RegisterInput';

export const validateRegisterInput = (registerInput: RegisterInput) => {
   if (!registerInput.email.includes('@'))
      return {
         message: 'Invalid email',
         errors: [
            {
               field: 'email',
               message: 'Email must contain @ symbol',
            },
         ],
      };

   if (registerInput.password.length < 6)
      return {
         message: 'Invalid password',
         errors: [
            {
               field: 'password',
               message: 'Password have to have at least 6 characters',
            },
         ],
      };

   if (registerInput.username.includes('@'))
      return {
         message: 'Invalid username',
         errors: [
            {
               field: 'username',
               message: 'Username cannot contain @ symbol',
            },
         ],
      };

   return null;
};

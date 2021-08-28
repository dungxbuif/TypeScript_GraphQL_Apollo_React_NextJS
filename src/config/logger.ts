import chalk from 'chalk';

export default {
   error: (text: string, e = '') => console.log(chalk.bold.red(text + e)),
   succeed: (text: string) => console.log(chalk.bold.green(text)),
   cyan: (text: string) => console.log(chalk.bold.cyan(text)),
};

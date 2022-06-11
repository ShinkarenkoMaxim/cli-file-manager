export const getUsername = () => {
  let username = '';
  const args = process.argv.slice(2);

  // Check if username is specified
  if (args && args.includes('--username')) {
    const argsId = args.indexOf('--username');
    username = args[argsId + 1];
  } else {
    throw new Error('Username must be specified');
  }

  return username;
};

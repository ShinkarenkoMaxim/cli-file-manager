export const getUsername = () => {
  let username = '';
  const args = process.argv.slice(2);
  const hasUsernameArg = args && args[0].startsWith('--username');

  // Check if username is specified
  if (hasUsernameArg) {
    const hasEqualSeparator = args[0].startsWith('--username=');
    const hasSpaceSeparator = args[0] === '--username';

    if (hasEqualSeparator) {
      username = args[0].split('=')[1];
    }

    if (hasSpaceSeparator) {
      username = args[1];
    }
  } else {
    throw new Error('Username must be specified');
  }

  return username;
};

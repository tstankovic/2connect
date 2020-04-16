export const validateRegisterForm = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!username) {
    errors.username = 'This field is required';
  } else if (username.length < 3) {
    errors.username = 'Must be at least 3 characters long';
  }

  if (!email) {
    errors.email = 'This field is required';
  } else if (!email.includes('@')) {
    errors.email = 'Please enter a valid email adress';
  }

  if (!password) {
    errors.password = 'This field is required';
  } else if (password.length < 6) {
    errors.password = 'Must be at least 6 characters long';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = 'This field is required';
  } else if (!email.includes('@')) {
    errors.email = 'Please enter valid email adress';
  }

  if (!password) {
    errors.password = 'This field is required';
  } else if (password.length < 6) {
    errors.password = 'Must be at least 6 characters long';
  }

  return errors;
};

import bcrypt from "bcryptjs";

export const hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const comparePasswords = async function (password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

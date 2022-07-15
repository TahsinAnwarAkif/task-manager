import crypto from 'crypto';

export const generateHash = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

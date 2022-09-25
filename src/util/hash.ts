import { compare, genSalt, hash } from 'bcrypt';

/**
 * bcrypt hash the provided data
 */
export async function bcryptHash(plainData: string) {
  const saltToUse = await genSalt();
  return hash(plainData, saltToUse);
}

/**
 * bcrypt compare plain data with the hashed one
 */
export async function bcryptCompare(plainData: string, hashedData: string) {
  return compare(plainData, hashedData);
}

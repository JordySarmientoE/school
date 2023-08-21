import * as bcrypt from 'bcryptjs';

export async function encrypt(value: string) {
  const hashed = await bcrypt.hash(value, 10);
  return hashed;
}

export async function decrypt(value: string, hashed: string) {
  const compared = await bcrypt.compare(value, hashed);
  return compared;
}

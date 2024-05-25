import { db } from '..';
import { users, accounts } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const loginUser = async (username: string, password: string) => {
  // check if user is sign up with oauth
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (user.length === 0) {
    return null;
  }

  const isValid = bcrypt.compare(password, user[0].password!);
  if (!isValid) {
    return null;
  }
  return user[0];
};

export const getUserById = async (id: number) => {
  const user = await db.select().from(users).where(eq(users.id, id.toString()));
  return user[0];
};

export const createUser = async (
  name: string,
  email: string,
  username: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db
    .insert(users)
    .values({ name, email, username, password: hashedPassword })
    .returning();

  // create a account for the user
  await db
    .insert(accounts)
    .values({
      userId: user[0].id,
      type: 'email',
      provider: 'email',
      providerAccountId: email,
    })
    .returning();
  return user;
};
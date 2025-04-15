import { defineEventHandler, readBody } from 'h3';
import { md5 } from 'js-md5'; // Simple MD5 hasher
import type { User } from '~/types';
// Adjust the path based on your actual structure if needed
import usersData from '../data/users.json';

// Cast the imported JSON data to the User[] type
const users: User[] = usersData as User[];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    // Use Nuxt 3's built-in error handling
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    });
  }

  const user = users.find(u => u.credentials.username === username);

  if (!user) {
     throw createError({
      statusCode: 401, // Unauthorized
      statusMessage: 'Invalid credentials',
    });
  }

  // --- Password Validation ---
  // IMPORTANT: MD5 is insecure for real-world password hashing.
  // This uses MD5 ONLY because the provided 'passphrase' looks like an MD5 hash.
  // A real application should use bcrypt or Argon2.
  const hashedPassword = md5(password);

  if (hashedPassword !== user.credentials.passphrase) {
    throw createError({
      statusCode: 401, // Unauthorized
      statusMessage: 'Invalid credentials',
    });
  }

  // Login successful
  // Return user data MINUS sensitive information
  const { credentials, _comment, ...userToReturn } = user;
  return {
    id: user.credentials.username, // Use username as ID
    name: user.name,
    surname: user.surname,
    active: user.active,
    created: user.created,
  };
});

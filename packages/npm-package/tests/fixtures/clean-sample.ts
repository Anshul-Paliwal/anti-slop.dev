// Test fixture: Clean code that should produce zero slop issues
// DO NOT modify this file — it validates zero-issue baseline

export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Validate that a user object has all required fields.
 */
export function isValidUser(user: Partial<User>): user is User {
  if (!user.id || !user.name || !user.email) {
    return false;
  }
  return user.email.includes('@');
}

/**
 * Format a user's display name.
 */
export function formatDisplayName(user: User): string {
  return `${user.name} <${user.email}>`;
}

/**
 * Filter active users from a list.
 */
export function getActiveUsers(users: User[], activeIds: Set<string>): User[] {
  return users.filter((user) => activeIds.has(user.id));
}

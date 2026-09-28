/**
 * Centralized user roles. Do not scatter role strings throughout the codebase —
 * always import UserRole from here.
 */
export const UserRole = {
  CUSTOMER: "CUSTOMER",
  SHOPKEEPER: "SHOPKEEPER",
  DELIVERY: "DELIVERY",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

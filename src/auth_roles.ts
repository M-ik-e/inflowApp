// 1. Explicitly type the object structure
const ROLE_POWER: Record<string, number> = {
  readonly: 1,
  analyst: 2,
  admin: 3,
  owner: 4,
  localGod: 5
};

// 2. Type userRole as a generic string
export default function hasAccess(userRole: string, requiredRole: 'readonly' | 'analyst' | 'admin' | 'owner' | 'localGod'): boolean {
  // Guard clause: if the role doesn't exist in our dictionary, deny access
  if (!userRole || !(userRole in ROLE_POWER)) return false;
  
  // TypeScript is now happy because it knows ROLE_POWER accepts string indexes!
  return ROLE_POWER[userRole] >= ROLE_POWER[requiredRole];
}
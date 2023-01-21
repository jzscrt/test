/**
 * Roles Format:
 * {{route}}
 * or {{model}}_rwx, where
 * o = write / update own data permission
 * r = read-only all data permission
 * w = write / update all data permission
 * x = all data delete permission
 */

const allRoles = {
  su: ['user-orwx', 'auth$logout'],
  admin: ['user-orw', 'auth$logout'],
  user: ['user-o', 'auth$logout'],
};

/**
 * roleRights - A Map object that maps the roles to an array of permissions
 *
 * @type {Map<string, string[]>}
 */
const roleRights = new Map(Object.entries(allRoles));

export { roleRights };

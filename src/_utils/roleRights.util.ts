/**
 * mergeRoleRights - merges multiple roles into a single object
 *
 * @param {any[]} roles - an array of role objects to merge
 * @returns {Object} - an object containing all the merged roles
 */
export const mergeRoleRights = (roles: any[]): any[] => {
  return roles.reduce((result, role) => {
    const key = Object.keys(role)[0];
    if (result[key]) {
      result[key] = [...result[key], ...role[key]];
    } else {
      result[key] = role[key];
    }
    return result;
  }, {});
};

/**
 * mapRoles - maps an array of strings to an array of role objects
 *
 * @param {any[]} arr - array of strings in the format 'model-permissions' or `route-function`
 * @returns {Array} - an array of role objects in the format { role: [permissions] }
 */
export const mapRoles = (arr: string[]): any[] => {
  return arr.map((val: string) => {
    const [module, permissions] = val.split(/[-$]/);
    return {
      [module]: val.includes('$') ? (typeof permissions === 'string' ? [permissions] : permissions) : [...permissions].map((p: string) => p),
    };
  });
};

/**
 * checkRights - checks if a user has the required rights to perform an action
 *
 * @param {any[]} userRights - an array of rights that the user has
 * @param {any[]} allowedRights - an array of rights required to perform an action
 * @returns {boolean} - true if the user has the required rights, false otherwise
 */
export const checkRights = (userRights: any[], allowedRights: any[]): boolean => {
  let res = false;
  for (const allowedRightKey in allowedRights) {
    res = false;
    if (userRights.hasOwnProperty(allowedRightKey)) {
      res = Object.values(allowedRights[allowedRightKey]).every((allowedRight: string) => userRights[allowedRightKey].includes(allowedRight));
    }
  }
  return res;
};

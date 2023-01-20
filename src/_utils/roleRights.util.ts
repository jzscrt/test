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
      [module]: val.includes('$') ? permissions : [...permissions].map((p: string) => p),
    };
  });
};

export const checkRights = (userRights: any[], allowedRights: any[]): boolean => {
  return userRights.every(userRight => {
    return Object.keys(userRight).every(key => {
      return allowedRights.some(allowedRight => {
        return (
          key in allowedRight &&
          (Array.isArray(userRight[key])
            ? userRight[key].every((userValue: any) => allowedRight[key].includes(userValue))
            : userRight[key] === allowedRight[key])
        );
      });
    });
  });
};

import { actions, roles } from "./Constants.js";

const mappings = new Map();

mappings.set(actions.VIEW_PRODUCTS, [roles.ADMIN, roles.SALES, roles.PACKAGER]);
mappings.set(actions.DELETE_PRODUCTS, [roles.ADMIN]);
mappings.set(actions.CREATE_PRODUCTS, [roles.ADMIN]);
mappings.set(actions.UPDATE_PRODUCTS, [roles.ADMIN]);
mappings.set(actions.SEE_ALL_PRODUCTS, [roles.ADMIN, roles.SALES]);
mappings.set(actions.CREATE_USER, [roles.ADMIN]);
mappings.set(actions.CREATE_ORDER, [roles.ADMIN, roles.SALES]);
mappings.set(actions.CREATE_CLIENTS, [roles.ADMIN, roles.SALES]);
mappings.set(actions.VIEW_ORDERS, [roles.ADMIN, roles.SALES, roles.PACKAGER]);
mappings.set(actions.SET_PACKAGED, [roles.ADMIN, roles.PACKAGER]);
mappings.set(actions.SET_PAYED, [roles.ADMIN, roles.SALES]);
mappings.set(actions.EDIT_USERS, [roles.ADMIN]);

function hasPermission(file, action) {
  if (!file) {
    return false;
  }

  if (mappings.has(action)) {
    return mappings.get(action).some((element) => {
      return file.includes(element);
    });
  }

  return false;
}

export { hasPermission };

export default mappings;

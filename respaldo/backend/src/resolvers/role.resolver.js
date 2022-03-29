import { AuthenticationError } from "apollo-server-express";

import { Role } from "../models/Role";

const getRoles = async (_, args, { user }) => {
  if (user) {
    return await Role.find();
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createRole = async (_, { role }, { user }) => {
  if (user) {
    const item = new Role(role);
    await item.save();
    return item;
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

export const RoleResolver = {
  getRoles,
  createRole,
};

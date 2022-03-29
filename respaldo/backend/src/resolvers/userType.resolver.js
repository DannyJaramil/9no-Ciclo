import { AuthenticationError } from "apollo-server-express";

import { UserType } from "../models/UserType";

const getUserTypes = async (_, args, { user }) => {
  if (user) {
    return await UserType.find();
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getUserType = async (_, { id }, { user }) => {
  if (user) {
    return await UserType.findById(id);
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createUserType = async (_, { userType }, { user }) => {
  if (user) {
    try {
      const newUserType = new UserType(userType);
      await newUserType.save();

      console.log("[INFO] Tipo de usuario registrado: " + newUserType.id);
      return {
        message: "El Tipo de usuario ha sido agregado correctamente.",
        id: newUserType.id,
      };
    } catch (error) {
      console.log("[ERROR] " + error);
      return {
        message: "Ha ocurrido un error al guardar los datos",
        id: null,
      };
    }
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const updateUserType = async (_, { userType, id }, { user }) => {
  if (user) {
    try {
      const updatedUserType = await UserType.findOneAndUpdate(
        { _id: id },
        userType
      );

      return {
        message: "El Tipo de usuario ha sido modificado correctamente.",
        id: updatedUserType.id,
      };
    } catch (error) {
      console.log("[ERROR] " + error);
      return {
        message: "Ha ocurrido un error al guardar los datos",
        id: null,
      };
    }
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

export const UserTypeResolver = {
  getUserTypes,
  getUserType,
  createUserType,
  updateUserType,
};

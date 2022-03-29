import { AuthenticationError } from "apollo-server-express";

import { Tax } from "../models/Tax";

const getTaxes = async (_, args, { user }) => {
  if (user) {
    return await Tax.find();
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getTax = async (_, { id }, { user }) => {
  if (user) {
    return await Tax.findById(id);
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createTax = async (_, { tax }, { user }) => {
  if (user) {
    try {
      const newTax = new Tax(tax);
      await newTax.save();

      console.log("[INFO] Impuesto registrado: " + newTax.id);
      return {
        message: "El Impuesto ha sido agregado correctamente.",
        id: newTax.id,
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

const updateTax = async (_, { tax, id }, { user }) => {
  if (user) {
    try {
      const updatedTax = await Tax.findOneAndUpdate({ _id: id }, tax);

      return {
        message: "El Impuesto ha sido modificado correctamente.",
        id: updatedTax.id,
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

export const TaxResolver = {
  getTaxes,
  getTax,
  createTax,
  updateTax,
};

import { AuthenticationError } from "apollo-server-express";

import { PaymentType } from "../models/PaymentType";

const getPaymentTypes = async (_, args, { user }) => {
  if (user) {
    return await PaymentType.find();
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getPaymentType = async (_, { id }, { user }) => {
  if (user) {
    return await PaymentType.findById(id);
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createPaymentType = async (_, { paymentType }, { user }) => {
  if (user) {
    try {
      const newPaymentType = new PaymentType(paymentType);
      await newPaymentType.save();

      console.log("[INFO] Tipo de pago registrado: " + newPaymentType.id);
      return {
        message: "El Tipo de pago ha sido agregado correctamente.",
        id: newPaymentType.id,
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

const updatePaymentType = async (_, { paymentType, id }, { user }) => {
  if (user) {
    try {
      const updatedPaymentType = await PaymentType.findOneAndUpdate(
        { _id: id },
        paymentType
      );

      return {
        message: "El tipo de pago ha sido modificado correctamente.",
        id: updatedPaymentType.id,
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

export const PaymentTypeResolver = {
  getPaymentTypes,
  getPaymentType,
  createPaymentType,
  updatePaymentType,
};

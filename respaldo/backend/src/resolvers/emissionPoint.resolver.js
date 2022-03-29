import { AuthenticationError } from "apollo-server-express";
import { EmissionPoint } from "../models/EmissionPoint";

const getEmissionPoints = async (_, { queries, establishment }, { user }) => {
  if (user) {
    const { search } = queries;
    let aditionalSearch = search
      ? {
          code: {
            $regex: search,
            $options: "i",
          },
        }
      : {};

    return await EmissionPoint.find({
      establishment,
      ...aditionalSearch,
    }).populate("establishment");
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getAllEmissionPoints = async (_, args, { user }) => {
  if(user){
    return await EmissionPoint.find().populate("establishment");
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getEmissionPoint = async (_, { id, establishment }, { user }) => {
  if (user) {
    return await EmissionPoint.findOne({ _id: id, establishment }).populate("establishment");
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createEmissionPoint = async (_, { emissionPoint }, { user }) => {
  if (user) {
    try {
      const newEmissionPoint = new EmissionPoint(emissionPoint);
      await newEmissionPoint.save();
      console.log("[INFO] Punto de Emisión registrado: " + newEmissionPoint.id);

      return {
        message: "El punto de Emisión ha sido agregado correctamente.",
        id: newEmissionPoint.id,
      };
    } catch (error) {
      console.log(`[ERROR] ${error}`);
      return {
        message: "Ha ocurrido un error al guardar los datos",
        id: null,
      };
    }
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const updateEmissionPoint = async (_, { emissionPoint, id }, { user }) => {
  if (user) {
    try {
      const updatedEmissionPoint = await EmissionPoint.findOneAndUpdate(
        { _id: id },
        emissionPoint
      );

      return {
        message: "El punto de Emisión ha sido modificado correctamente.",
        id: updatedEmissionPoint.id,
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

export const EmissionPointResolver = {
  getEmissionPoints,
  getAllEmissionPoints,
  getEmissionPoint,
  createEmissionPoint,
  updateEmissionPoint,
};

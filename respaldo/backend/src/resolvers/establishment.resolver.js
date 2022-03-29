import { AuthenticationError } from "apollo-server-express";
import { cloudinaryUpload } from "../config/cloudinary";

import { Establishment } from "../models/Establishment";

const getEstablishments = async (_, { queries }, { user }) => {
  if (user) {
    const { search } = queries;
    let aditionalSearch = search
      ? {
          $or: [
            {
              code: {
                $regex: search,
                $options: "i",
              },
            },
            {
              commercialName: {
                $regex: search,
                $options: "i",
              },
            },
            {
              shortName: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
            {
              phone_number: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    return await Establishment.find(aditionalSearch);
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getEstablishment = async (_, { id }, { user }) => {
  if (user) {
    return await Establishment.findById(id);
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createEstablishment = async (
  _,
  { establishment: { logo, ...rest } },
  { user }
) => {
  if (user) {
    try {
      let establishment = rest;
      if (logo) {
        const { createReadStream } = await logo;
        const stream = await createReadStream();

        const result = await cloudinaryUpload(stream, {
          folder: "establishments",
        });

        establishment.logo = result.public_id;
        console.log("[Cloudinary Result]", result);
      }

      const newEstablishment = new Establishment(establishment);
      await newEstablishment.save();
      console.log("[INFO] Establecimiento registrado: " + newEstablishment.id);

      return {
        message: "El establecimiento ha sido agregado correctamente.",
        id: newEstablishment.id,
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

const updateEstablishment = async (
  _,
  { establishment: { logo, previousLogo, ...rest }, id },
  { user }
) => {
  if (user) {
    try {
      let establishment = rest;

      if (logo) {
        const { createReadStream } = await logo;
        const stream = await createReadStream();

        let options = {};
        if (previousLogo) {
          options.public_id = previousLogo;
          options.invalidate = true;
        } else options.folder = "establishments";

        const result = await cloudinaryUpload(stream, options);

        establishment.logo = result.public_id;
        console.log("[Cloudinary Result]", result);
      }

      const updatedEstablishment = await Establishment.findOneAndUpdate(
        { _id: id },
        establishment
      );

      return {
        message: "El establecimiento ha sido modificado correctamente.",
        id: updatedEstablishment.id,
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

export const EstablishmentResolver = {
  getEstablishments,
  getEstablishment,
  createEstablishment,
  updateEstablishment,
};

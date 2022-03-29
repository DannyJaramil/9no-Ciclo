import { AuthenticationError } from "apollo-server-express";

import { Product } from "../models/Product";

const getProducts = async (_, { offset, limit, queries }, { user }) => {
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
              auxiliar_code: {
                $regex: search,
                $options: "i",
              },
            },
            {
              product_type: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const products = await Product.find(aditionalSearch)
      .populate("taxes")
      .skip(limit * offset - limit)
      .limit(limit);

    const total = await Product.countDocuments(aditionalSearch);

    return { products, total };
  }
  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getSuggestions = async (_, { search }, { user }) => {
  if (user) {
    if (search && search?.length > 0) {
      const suggestions = await Product.find({
        $or: [
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            code: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }).limit(3).populate("taxes");

      return suggestions;
    }

    return [];
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getProduct = async (_, { id }, { user }) => {
  try {
    if (user) {
      return await Product.findById(id).populate("taxes");
    }
    throw new AuthenticationError("Sorry, you're not an authenticated user!");
  } catch (error) {
    console.error(`[ERROR] ${error}`);
    return {
      message: "Ha ocurrido un error al obtener los datos.",
      id: null,
    };
  }
};

const createProduct = async (_, { product }, { user }) => {
  if (user) {
    try {
      const item = new Product(product);
      await item.save();

      console.log("[INFO] Producto registrado: " + item.id);
      return {
        message: "El producto ha sido agregado correctamente.",
        id: item.id,
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

const updateProduct = async (_, { productUpdated, id }, { user }) => {
  try {
    if (user) {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        productUpdated
      );

      return {
        message: "El producto ha sido modificado correctamente.",
        id: product._id,
      };
    }
    throw new AuthenticationError("Sorry, you're not an authenticated user!");
  } catch (error) {
    console.error(`[ERROR] ${error}`);
    return {
      message: "Ha ocurrido un error al modificar los datos.",
      id: null,
    };
  }
};

export const ProductResolver = {
  getProducts,
  getProduct,
  getSuggestions,
  createProduct,
  updateProduct,
};

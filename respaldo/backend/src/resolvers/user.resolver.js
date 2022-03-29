import { AuthenticationError } from "apollo-server-express";
import { hashSync } from "bcryptjs";

import { User } from "../models/User";
import { Account } from "../models/Account";
import { Role } from "../models/Role";

const getCustomers = async (_, { offset, limit, queries }, { user }) => {
  if (user) {
    const role = await Role.findOne({ code: "customer" }).exec();

    const { search } = queries;
    let aditionalSearch = search
      ? {
          $or: [
            {
              business_name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              tradename: {
                $regex: search,
                $options: "i",
              },
            },
            {
              dni: {
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

    const users = await User.find({
      role: role.id,
      ...aditionalSearch,
    })
      .populate("role")
      .populate("user_type")
      .skip(limit * offset - limit)
      .limit(limit);

    const total = await User.countDocuments({
      role: role.id,
      ...aditionalSearch,
    });

    return { users, total };
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getSuggestions = async (_, { search }, { user }) => {
  if (user) {
    if (search && search?.length > 0) {
      const role = await Role.findOne({ code: "customer" }).exec();

      var data = await User.find({
        role: role.id,
        $or: [
          {
            business_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            tradename: {
              $regex: search,
              $options: "i",
            },
          },
          {
            dni: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      })
        .limit(3)
        .populate("role");

      const suggestions = data.map(async (suggestion) => {
        let account = await Account.findOne({ user: suggestion.id });
        suggestion.account = account;

        return suggestion;
      });

      return suggestions;
    }

    return [];
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getCustomer = async (_, { id }, { user }) => {
  try {
    if (user) {
      const role = await Role.findOne({ code: "customer" }).exec();
      const account = await Account.findOne({ user: id }).populate({
        path: "user",
        match: {
          role: role.id,
        },
        populate: {
          path: "user_type",
        },
      });

      return {
        ...account.user.toObject(),
        user_type: account.user.user_type,
        id: account.user._id,
        email: account.email,
      };
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

const createUser = async (_, { user }, { user: user_auth }) => {
  if (user_auth) {
    try {
      const role = await Role.findOne({ code: "customer" }).exec();

      const email = user.email;
      delete user.email;

      user.role = role.id;

      const item = new User(user);
      await item.save();

      const password = hashSync(user.dni, 10);
      const account = new Account({
        email: email,
        password: password,
        user: item.id,
      });
      await account.save();

      console.log("[INFO] Cliente registrado: " + account.user);
      return {
        message: "El cliente ha sido registrado correctamente.",
        id: account.user,
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

const updateUser = async (_, { userUpdated, id }, { user }) => {
  try {
    if (user) {
      const user = await User.findOneAndUpdate({ _id: id }, userUpdated);
      return {
        message: "El usuario ha sido modificado correctamente.",
        id: user._id,
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

export const UserResolver = {
  getCustomers,
  getCustomer,
  getSuggestions,
  createUser,
  updateUser,
};

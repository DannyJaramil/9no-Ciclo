import { AuthenticationError } from "apollo-server-express";

import { compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { Account } from "../models/Account";

const current = async (_, args, { user }) => {
  if (user) {
    console.log("[INFO] Token obtenido: ", user.email);
    return await Account.findById(user.id).populate({
      path: "user",
      populate: { path: "role" },
    });
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const login = async (_, { email, password }) => {
  const user = await Account.findOne({ email: email });

  if (!user) {
    console.log("[ERROR] ¡Intento de autenticación fallido!");
    throw new Error(
      "This user doesn't exist. Please, make sure to type the right email."
    );
  }

  const valid = compareSync(password, user.password);
  if (!valid) {
    throw new Error("You password is incorrect!");
  }
  const token = sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  console.log("[INFO] Autenticación exitosa: " + email);
  return token;
};

export const AuthenticationResolver = {
  current,
  login,
};

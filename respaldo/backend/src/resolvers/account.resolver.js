import { AuthenticationError } from "apollo-server-express";

import { Account } from "../models/Account";
import { hashSync } from "bcryptjs";

const getAccounts = async (_, args, { user }) => {
  if (user) {
    return Account.find().populate({
      path: "user",
      populate: { path: "role" },
    });
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createAccount = async (_, { account }, { user }) => {
  if (user) {
    account.password = hashSync(account.password, 10);

    const item = new Account(account);
    await item.save();
    return item;
  }

  throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

export const AccountResolver = {
  getAccounts,
  createAccount,
};

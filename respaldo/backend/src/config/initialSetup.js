import { hashSync } from "bcryptjs";

import {
    admin_role,
    customer_role
} from "./definitions";

import { Role } from "../models/Role";
import { User } from "../models/User";
import { Account } from "../models/Account";

export const setDefaultAdmin = async () => {
    try {
        const role_count = await Role.estimatedDocumentCount();

        if(role_count > 0)
            return;
        
        console.log("[INFO] Generating the administration account...");
        
        const a_role = new Role(admin_role);
        await a_role.save();

        const roles = [customer_role];
        await Role.insertMany(roles);
        
        const admin_user_data = {
            business_name: "The business",
            dni_type: "Cédula de Identidad",
            dni: "N/D",
            address: "N/D",
            phone_number: "N/D",
            role: a_role.id
        };
        
        const user_model =  new User(admin_user_data);
        await user_model.save();
        
        const admin_account_data = {
            email: "admin@localhost.com",
            password: hashSync("admin_pass"),
            user: user_model.id
        };

        const account_model = new Account(admin_account_data);
        await account_model.save();
        
        console.log("[INFO] Account generated successfully!");
    } catch (error) {
        Role.remove({});
        User.remove({});
        Account.remove({});

        console.log("[ERROR] An error occurred while creating the administration account!");
       
    }
}
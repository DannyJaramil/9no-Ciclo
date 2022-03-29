import { AuthenticationError } from "apollo-server-express";
import { PurchaseInvoice } from "../models/PurchaseInvoice";
import { Account } from "../models/Account";

const getInvoices = async (_, { offset, limit, queries }, { user }) => {
	if (user) {
		const { search } = queries;
		let aditionalSearch = search ? {
			$or: [
				{
					invoice_number: {
						$regex: search,
						$options: "i",
					}
				}
			]
		} : {};

		const invoices = await PurchaseInvoice.find(aditionalSearch)
			.populate("provider")
			.sort({ _id: 'desc' })
			.skip(limit * offset - limit)
			.limit(limit);

		const total = await PurchaseInvoice.countDocuments(aditionalSearch);

		return { invoices, total };
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getInvoice = async (_, { id }, { user }) => {
	if (user) {
		var invoice = await PurchaseInvoice.findById(id)
			.populate("provider")
			.populate({
				path: "items.product",
				populate: { path: "taxes" },
			});

		var account = await Account.findOne({ user: invoice.provider.id });
		invoice.provider.account = account;
		
		return invoice;
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createInvoice = async(_, { invoice }, { user }) => {
    if(user){
        const item = new PurchaseInvoice(invoice);
		await item.save();

        return {
			message: "La factura de compra ha sido registrada correctamente.",
			id: item.id,
		};
    }

    throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const updateInvoice = async (_, { invoice, id }, { user }) => {
	if(user){
		invoice.modified_at = new Date();
		const invoice_doc = await PurchaseInvoice.findByIdAndUpdate(id, invoice);

		return {
			message: "La factura ha sido editada correctamente.",
			id: invoice_doc.id,
		};
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

export const PurchaseInvoiceResolver = {
    getInvoices,
	getInvoice,
    createInvoice,
	updateInvoice,
};
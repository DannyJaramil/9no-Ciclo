import { AuthenticationError } from "apollo-server-express";
import { Config } from "../models/Config";
import { Invoice } from "../models/Invoice";
import { Payment } from "../models/Payment";

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

		const invoices = await Invoice.find(aditionalSearch)
			.populate("customer.reference")
			.sort({ _id: 'desc' })
			.skip(limit * offset - limit)
			.limit(limit);

		const total = await Invoice.countDocuments(aditionalSearch);

		return { invoices, total };
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
}

const getInvoice = async (_, { id }, { user }) => {
	if (user) {
		return await Invoice.findById(id)
			.populate("customer.reference")
			.populate({
				path: "items.product",
				populate: { path: "taxes" },
			});
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const createInvoice = async (_, { invoice }, { user }) => {
	if (user) {
		const invoice_number = await Config.findOne({ key: "invoice_number" });
		let add_zeros = (invoice_number.value.numeric + '').padStart(9, '0');
		invoice.invoice_number = invoice.emission_point + "-" + add_zeros;

		const item = new Invoice(invoice);
		await item.save();

		const payments = invoice?.payments.map(payment => {
			payment.invoice = item.id;
			return payment;
		});

		if (payments && payments.length > 0)
			await Payment.insertMany(payments);

		invoice_number.value.numeric += 1;
		await invoice_number.save();

		return {
			message: "La factura ha sido registrada correctamente.",
			id: item.id,
		};
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
}

const updateInvoice = async (_, { invoice, id }, { user }) => {
	if(user){
		invoice.modified_at = new Date();
		const invoice_doc = await Invoice.findByIdAndUpdate(id, invoice);
		
		const payments = invoice?.payments.map(payment => {
			payment.invoice = invoice_doc.id;
			return payment;
		});

		await Payment.deleteMany({ invoice: id });

		if (payments && payments.length > 0)
			await Payment.insertMany(payments);

		return {
			message: "La factura ha sido editada correctamente.",
			id: invoice_doc.id,
		};
	}

	throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

export const InvoiceResolver = {
	getInvoices,
	getInvoice,
	createInvoice,
	updateInvoice,
};

import { GraphQLUpload } from "graphql-upload";

import { ProductResolver } from "./resolvers/product.resolver";
import { RoleResolver } from "./resolvers/role.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { AccountResolver } from "./resolvers/account.resolver";
import { AuthenticationResolver } from "./resolvers/authentication.resolver";
import { PaymentTypeResolver } from "./resolvers/paymentType.resolver";
import { UserTypeResolver } from "./resolvers/userType.resolver";
import { TaxResolver } from "./resolvers/Tax.resolver";
import { EstablishmentResolver } from "./resolvers/establishment.resolver";
import { EmissionPointResolver } from "./resolvers/emissionPoint.resolver";
import { InvoiceResolver } from "./resolvers/invoice.resolver";
import { PaymentResolver } from "./resolvers/payment.resolver";
import { PurchaseInvoiceResolver } from "./resolvers/purchaseInvoice.resolver";

export const resolvers = {

  Upload: GraphQLUpload,

  Query: {
    current: AuthenticationResolver.current,
    roles: RoleResolver.getRoles,
    customers: UserResolver.getCustomers,
    customer: UserResolver.getCustomer,
    customerSuggestions: UserResolver.getSuggestions,
    accounts: AccountResolver.getAccounts,
    products: ProductResolver.getProducts,
    product: ProductResolver.getProduct,
    paymentTypes: PaymentTypeResolver.getPaymentTypes,
    paymentType: PaymentTypeResolver.getPaymentType,
    userTypes: UserTypeResolver.getUserTypes,
    userType: UserTypeResolver.getUserType,
    taxes: TaxResolver.getTaxes,
    tax: TaxResolver.getTax,
    establishments: EstablishmentResolver.getEstablishments,
    establishment: EstablishmentResolver.getEstablishment,
    emissionPoints: EmissionPointResolver.getEmissionPoints,
    allEmissionPoints: EmissionPointResolver.getAllEmissionPoints,
    emissionPoint: EmissionPointResolver.getEmissionPoint,
    invoices: InvoiceResolver.getInvoices,
    invoice: InvoiceResolver.getInvoice,
    payments: PaymentResolver.getPayments,
    paymentsById: PaymentResolver.getPaymentsById,
    productSuggestions: ProductResolver.getSuggestions,
    purchaseInvoices: PurchaseInvoiceResolver.getInvoices,
    purchaseInvoice: PurchaseInvoiceResolver.getInvoice,
  },

  Mutation: {
    login: AuthenticationResolver.login,
    createRole: RoleResolver.createRole,
    createUser: UserResolver.createUser,
    updateUser: UserResolver.updateUser,
    createAccount: AccountResolver.createAccount,
    createProduct: ProductResolver.createProduct,
    updateProduct: ProductResolver.updateProduct,
    createPaymentType: PaymentTypeResolver.createPaymentType,
    updatePaymentType: PaymentTypeResolver.updatePaymentType,
    createUserType: UserTypeResolver.createUserType,
    updateUserType: UserTypeResolver.updateUserType,
    createTax: TaxResolver.createTax,
    updateTax: TaxResolver.updateTax,
    createEstablishment: EstablishmentResolver.createEstablishment,
    updateEstablishment: EstablishmentResolver.updateEstablishment,
    createEmissionPoint: EmissionPointResolver.createEmissionPoint,
    updateEmissionPoint: EmissionPointResolver.updateEmissionPoint,
    createInvoice: InvoiceResolver.createInvoice,
    updateInvoice: InvoiceResolver.updateInvoice,
    createPayment: PaymentResolver.createPayment,
    createPurchaseInvoice: PurchaseInvoiceResolver.createInvoice,
    updatePurchaseInvoice: PurchaseInvoiceResolver.updateInvoice,
    createPaymentPurcharseInvoice:PaymentResolver.createPaymentPurcharseIn,
  },
};

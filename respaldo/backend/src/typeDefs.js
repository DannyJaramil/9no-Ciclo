import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Upload

  type Query {
    current: Account
    roles: [Role!]!
    customers(offset: Int!, limit: Int!, queries: Queries): UsersResult!
    customer(id: ID!): User
    accounts: [Account!]!
    products(offset: Int!, limit: Int!, queries: Queries): ProductsResult!
    product(id: ID!): Product
    paymentTypes: [PaymentType!]!
    paymentType(id: ID!): PaymentType
    userTypes: [UserType!]!
    userType(id: ID!): UserType
    taxes: [Tax!]!
    tax(id: ID!): Tax
    establishments(queries: Queries): [Establishment!]!
    establishment(id: ID!): Establishment
    emissionPoints(queries: Queries, establishment: ID!): [EmissionPoint!]!
    allEmissionPoints: [EmissionPoint!]!
    emissionPoint(id: ID!, establishment: ID!): EmissionPoint
    customerSuggestions(search: String!): [UserAccount!]!
    productSuggestions(search: String!): [Product!]!
    invoices(offset: Int!, limit: Int!, queries: Queries): InvoicesResult!
    invoice(id: ID!): Invoice
    payments(offset: Int!, limit: Int!, queries: Queries): PaymentsResult!
    paymentsById(id: ID!): [Payment!]!
    purchaseInvoices(offset: Int!, limit: Int!, queries: Queries): PurchaseInvoicesResult!
    purchaseInvoice(id: ID!): PurchaseInvoice
  }

  type Mutation {
    login(email: String!, password: String!): String
    createRole(role: RoleInput): Role!
    createUser(user: UserInput): Response!
    updateUser(userUpdated: UserInput!, id: ID!): Response!
    createAccount(account: AccountInput): Account!
    createProduct(product: ProductInput): Response!
    updateProduct(productUpdated: ProductInput!, id: ID!): Response!
    createPaymentType(paymentType: PaymentTypeInput!): Response!
    updatePaymentType(paymentType: PaymentTypeInput!, id: ID!): Response!
    createUserType(userType: UserTypeInput!): Response!
    updateUserType(userType: UserTypeInput!, id: ID!): Response!
    createTax(tax: TaxInput!): Response!
    updateTax(tax: TaxInput!, id: ID!): Response!
    createEstablishment(establishment: EstablishmentInput!): Response!
    updateEstablishment(establishment: EstablishmentInput!, id: ID!): Response!
    createEmissionPoint(emissionPoint: EmissionPointInput!): Response!
    updateEmissionPoint(emissionPoint: EmissionPointInput!, id: ID!): Response!
    createInvoice(invoice: InvoiceInput): Response!
    updateInvoice(invoice: InvoiceInput, id: ID): Response!
    createPayment(payment: PaymentInput): Response!
    createPurchaseInvoice(invoice: PurchaseInvoiceInput): Response!
    updatePurchaseInvoice(invoice: PurchaseInvoiceInput, id: ID): Response!


    createPaymentPurcharseInvoice(payment: PaymentInput): Response!

    deleteInvoice(invoice: InvoiceInput, id: ID): Response!     
 
  }

  type Response {
    message: String!
    id: ID
  }

  type ProductsResult {
    products: [Product!]!
    total: Int!
  }

  type Product {
    id: ID!
    code: String!
    auxiliar_code: String
    product_type: String!
    prices: [PriceItem!]
    description: String!
    aditional_details: String
    measurement_unit: String
    cost: Float
    tags: [String!]
    status: Boolean
    bulk_sale: Boolean
    taxes: [Tax!]
    deleted: Boolean
    created_at: String
    modified_at: String
  }

  type Establishment {
    id: ID!
    code: String!
    logo: String
    commercialName: String!
    shortName: String!
    province: String
    city: String
    address: String
    phone: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type EmissionPoint {
    id: ID!
    code: String!
    description: String
    establishment: Establishment!
    createdAt: String
    updatedAt: String
  }

  type PaymentType {
    id: ID!
    name: String!
    active: Boolean
    deleted: Boolean
    createdAt: String
    updatedAt: String
  }

  type UserType {
    id: ID!
    name: String!
    active: Boolean
    deleted: Boolean
    createdAt: String
    updatedAt: String
  }

  type PriceItem {
    value: Float!
  }

  type Tax {
    id: ID!
    name: String!
    type: String!
    description: String
    percentage: Float!
    createdAt: String
    updatedAt: String
  }

  type Invoice {
    id: ID!
    customer: CustomerItem
    emission_date: String!
    emission_point: String!
    referral_guide: String
    items: [InvoiceItem!]!
    aditional_information: String
    subtotal: Float!
    iva_value: Float!
    ice_value: Float!
    total: Float!
    pending_balance: Float!
    total_paid: Float!
    credit: CreditItem!
    retentions: RetentionItem!
    invoice_number: String
    status: String!
    authorized: Boolean!
    modified_at: String!
  }

  type CustomerItem {
    reference: User
    address: String
    email: String
  }

  type InvoiceItem {
    product: Product!
    quantity: Int!
    price: Float!
    discount: Float!
    subtotal: Float!
  }

  type CreditItem {
    time_limit: String
    amount: Float
  }

  type RetentionItem {
    rental: Float
    iva: Float
  }

  type InvoicesResult {
    invoices: [Invoice!]!
    total: Int!
  }

  type Payment {
    id: ID!
    invoice: Invoice!
    amount: Float!
    method: PaymentType!
    notes: String!
    created_at: String!
    payment_date: String!
  }

  type PaymentsResult {
    payments: [Payment]!
    total: Int!
  }

  type PurchaseInvoice {
    id: ID!
    provider: UserAccount!
    emission_date: String!
    max_payment_date: String!
    referral_guide: String
    items: [InvoiceItem!]!
    subtotal: Float!
    iva_value: Float!
    ice_value: Float!
    total: Float!
    pending_balance: Float!
    total_paid: Float!
    invoice_number: String!
    status: String!
    auth_number: String
    modified_at: String!
  }

  type PurchaseInvoicesResult {
    invoices: [PurchaseInvoice!]!
    total: Int!
  }

  type Role {
    id: ID!
    name: String!
    code: String!
    permissions: [Permissions!]
    created_at: String
    modified_at: String
  }

  type Permissions {
    resource: String!
    action: String!
  }

  type UsersResult {
    users: [User!]!
    total: Int!
  }

  type User {
    id: ID!
    business_name: String!
    tradename: String
    user_type: UserType!
    dni_type: String!
    dni: String!
    address: String!
    phone_number: String!
    special_taxpayer: Boolean
    aditional_information: String
    email: String
    role: Role
    created_at: String
    modified_at: String
  }

  type UserAccount {
    id: ID!
    business_name: String!
    tradename: String
    dni_type: String!
    dni: String!
    address: String!
    phone_number: String!
    special_taxpayer: Boolean
    aditional_information: String
    email: String
    role: Role
    account: Account
    created_at: String
    modified_at: String
  }

  type Account {
    id: ID!
    email: String!
    user: User
    status: Boolean
    created_at: String
    modified_at: String
  }

  input RoleInput {
    name: String!
    code: String!
    permissions: [PermissionInput!]
    modified_at: String
  }

  input PermissionInput {
    resource: String!
    action: String!
  }

  input ProductInput {
    code: String!
    auxiliar_code: String
    product_type: String!
    prices: [PriceInput!]!
    description: String
    aditional_details: String
    measurement_unit: String
    cost: Float
    tags: [String!]
    status: Boolean
    bulk_sale: Boolean
    taxes: [ID!]
    deleted: Boolean
    modified_at: String
  }

  input PaymentTypeInput {
    name: String!
    active: Boolean
    deleted: Boolean
  }

  input UserTypeInput {
    name: String!
    active: Boolean
    deleted: Boolean
  }

  input EstablishmentInput {
    code: String!
    logo: Upload
    previousLogo: String
    commercialName: String!
    shortName: String!
    province: String!
    city: String!
    address: String!
    phone: String!
    email: String!
  }

  input EmissionPointInput {
    code: String!
    description: String!
    establishment: ID!
  }

  input PriceInput {
    value: Float!
  }

  input TaxInput {
    name: String!
    type: String!
    description: String
    percentage: Float!
  }

  input InvoiceInput {
    customer: CustomerInput
    emission_date: String!
    emission_point: String!
    referral_guide: String
    items: [InvoiceItemInput!]!
    aditional_information: String
    subtotal: Float!
    iva_value: Float!
    ice_value: Float!
    total: Float!
    pending_balance: Float!
    total_paid: Float!
    payments: [PaymentInput!]
    credit: CreditInput
    retentions: RetentionInput
  }

  input PaymentInput {
    invoice: ID
    payment_date: String
    method: String!
    amount: Float!
    notes: String
  }

  input CustomerInput {
    reference: ID
    address: String!
    email: String!
  }

  input InvoiceItemInput {
    product: String!
    quantity: Int!
    price: Float!
    discount: Float!
    subtotal: Float!
  }

  input CreditInput {
    time_limit: String
    amount: Float
  }

  input RetentionInput {
    rental: Float!
    iva: Float!
  }

  input PurchaseInvoiceInput {
    provider: ID!
    invoice_number: String!
    emission_date: String!
    max_payment_date: String!
    referral_guide: String
    auth_number: String
    items: [InvoiceItemInput!]!
    subtotal: Float!
    iva_value: Float!
    ice_value: Float!
    total: Float!
    pending_balance: Float!
    total_paid: Float!
  }

  input UserInput {
    business_name: String!
    tradename: String
    user_type: ID!
    dni_type: String!
    dni: String!
    address: String!
    phone_number: String!
    special_taxpayer: Boolean
    aditional_information: String
    email: String!
  }

  input AccountInput {
    email: String!
    password: String!
    user: String!
    status: Boolean
    modified_at: String
  }

  input Queries {
    search: String
    orderBy: String
    direction: String
  }
`;

import Summary from "./summary";

// Vouchers
import IndexVouchers from "./vouchers";

// Billing
import ListingBills from "./billing/issued/listing";
import NewBill from "./billing/issued/new";
import BillView from "./billing/issued/view";

import ListingReferralGuides from "./billing/referral_guide/listing";

// Purchases
import NewIssuedInvoice from "./purchases/invoices/new";
import ListingPurchaseInvoices from "./purchases/invoices/listing";
import PurchaseInvoiceView from "./purchases/invoices/view";

// Products
import ListingProducts from "./products/listing";
import NewProduct from "./products/new";

// Customers
import ListingCustomers from "./customers/listing";
import NewCustomer from "./customers/new";

// Payments
import Payments from "./payments/listing";

// Config
import Config from "./config";
import { NewPaymentType } from "./config/paymentType/new";
import { NewUserType } from "./config/userType/new";
import { NewTax } from "./config/tax/new";

// Business
import { Business } from "./busines";
import { NewEstablishment } from "./busines/establishment/new";
import { NewEmissionPoint } from "./busines/emissionPoint/new";

const routes = [
  {
    path: "/",
    name: "Resumen",
    icon: null,
    visible: false,
    component: Summary,
    children: [],
  },
  {
    path: "/comprobantes",
    name: "Comprobantes",
    icon: "bi bi-receipt-cutoff",
    visible: true,
    component: IndexVouchers,
    children: [],
  },
  {
    path: "/facturacion",
    name: "Comprobantes emitidos",
    icon: "bi bi-receipt-cutoff",
    visible: false,
    component: ListingBills,
    children: [
      {
        path: "/facturas",
        name: "Facturas",
        icon: null,
        visible: true,
        component: ListingBills,
      },
      {
        path: "/facturas/nuevo",
        name: "Nueva Factura",
        icon: null,
        visible: false,
        component: NewBill,
      },
      {
        path: "/facturas/vista/:id",
        name: "Vista de Factura",
        icon: null,
        visible: false,
        component: BillView,
      },
      {
        path: "/facturas/editar/:id",
        name: "Edición de Factura",
        icon: null,
        visible: false,
        component: NewBill,
      },
      {
        path: "/guias-de-remision",
        name: "Guías de remisión",
        icon: null,
        visible: true,
        component: ListingReferralGuides,
      },
      {
        path: "/retenciones",
        name: "Retenciones",
        icon: null,
        visible: true,
        component: ListingReferralGuides,
      }, 
    ],
  },
  {
    path: "/compras",
    name: "Comprobantes recibidos",
    icon: "bi bi-box-seam",
    visible: false,
    component: ListingPurchaseInvoices,
    children: [
      {
        path: "/facturas",
        name: "Facturas de compra",
        icon: null,
        visible: false,
        component: ListingPurchaseInvoices,
      },
      {
        path: "/facturas/nuevo",
        name: "Nueva Factura de Compra",
        icon: null,
        visible: false,
        component: NewIssuedInvoice,
      },
      {
        path: "/facturas/editar/:id",
        name: "Edición de Factura",
        icon: null,
        visible: false,
        component: NewIssuedInvoice,
      },
      {
        path: "/facturas/vista/:id",
        name: "Vista de Factura",
        icon: null,
        visible: false,
        component: PurchaseInvoiceView,
      },
    ]
  },
  {
    path: "/productos",
    name: "Productos",
    icon: "bi bi-box-seam",
    visible: true,
    component: ListingProducts,
    children: [
      {
        path: "/nuevo",
        name: "Nuevo Producto",
        icon: null,
        visible: true,
        component: NewProduct,
      },
      {
        path: "/modificar/:id",
        name: "Modificar Producto",
        icon: null,
        visible: false,
        component: NewProduct,
      },
    ],
  },
  {
    path: "/clientes",
    name: "Clientes",
    icon: "bi bi-people",
    visible: true,
    component: ListingCustomers,
    children: [
      {
        path: "/nuevo",
        name: "Registrar Cliente",
        icon: null,
        visible: true,
        component: NewCustomer,
      },
      {
        path: "/modificar/:id",
        name: "Modificar Cliente",
        icon: null,
        visible: false,
        component: NewCustomer,
      },
    ],
  },
  {
    path: "/pagos",
    name: "Pagos",
    icon: "bi bi-cash-stack",
    visible: true,
    component: Payments,
    children: [],
  },
  {
    path: "/negocio",
    name: "Negocio",
    icon: "bi bi-briefcase",
    visible: true,
    component: Business,
    children: [
      {
        path: "/establecimiento/nuevo",
        name: "Registrar Establecimiento",
        icon: null,
        visible: true,
        component: NewEstablishment,
      },
      {
        path: "/establecimiento/modificar/:id",
        name: "Modificar Establecimiento",
        icon: null,
        visible: false,
        component: NewEstablishment,
      },
      {
        path: "/:establishment/punto-emision/nuevo",
        name: "Registrar Punto de Emisión",
        icon: null,
        visible: false,
        component: NewEmissionPoint,
      },
      {
        path: "/:establishment/punto-emision/modificar/:id",
        name: "Modificar Punto de Emisión",
        icon: null,
        visible: false,
        component: NewEmissionPoint,
      },
    ],
  },
  {
    path: "/configuracion",
    name: "Configuración",
    icon: "bi bi-sliders",
    visible: true,
    component: Config,
    children: [
      {
        path: "/tipo-pago/nuevo",
        name: "Registrar Tipo de Pago",
        icon: null,
        visible: true,
        component: NewPaymentType,
      },
      {
        path: "/tipo-pago/modificar/:id",
        name: "Modificar Tipo de Pago",
        icon: null,
        visible: false,
        component: NewPaymentType,
      },
      {
        path: "/tipo-usuario/nuevo",
        name: "Registrar Tipo de Usuario",
        icon: null,
        visible: true,
        component: NewUserType,
      },
      {
        path: "/impuesto/nuevo",
        name: "Registrar Impuesto",
        icon: null,
        visible: true,
        component: NewTax,
      },
      {
        path: "/impuesto/modificar/:id",
        name: "Modificar Impuesto",
        icon: null,
        visible: false,
        component: NewTax,
      },
    ],
  },
];

export default routes;

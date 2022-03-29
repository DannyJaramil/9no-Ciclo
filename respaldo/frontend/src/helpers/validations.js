import * as yup from "yup";
import moment from "moment";

import { validations } from "./constants";

yup.setLocale({
  mixed: {
    required: "Este campo es requerido",
  },
  string: {
    email: "El correo ingresado no es válido",
    required: "El campo es requerido",
  },
});

yup.addMethod(yup.mixed, "fileSize", function (
  fileSize = 1024, // 1MB por defecto
  errorMessage = "Archivo demasiado grande"
) {
  let maxSize = Math.round((fileSize / 1024) * 100) / 100;
  return this.test(
    "fileSize",
    `${errorMessage} [Máximo: ${
      maxSize >= 1 ? maxSize + "MB" : fileSize + "KB"
    }]`,
    function (value) {
      const { path, schema, createError } = this;
      if (!schema.exclusiveTests.required && !value[0]) return true;
      if (!!schema.exclusiveTests.required && !value[0])
        return createError({ path, message: "El campo es requerido" });

      return value[0] && value[0].size <= fileSize * 1024;
    }
  );
});

yup.addMethod(
  yup.mixed,
  "fileFormat",
  function (supportedFormats = [], errorMessage = "Formato no soportado") {
    return this.test("fileFormat", errorMessage, function (value) {
      const { path, schema, createError } = this;
      if (!schema.exclusiveTests.required && !value[0]) return true;
      if (!!schema.exclusiveTests.required && !value[0])
        return createError({ path, message: "El campo es requerido" });
      return value[0] && supportedFormats.includes(value[0].type);
    });
  }
);

export const loginSchema = yup.object().shape({
  email: yup.string().required().email().trim(),
  password: yup.string().required().trim(),
});

export const productSchema = yup.object().shape({
  code: yup.string().required().trim(),
  auxiliar_code: yup.string().trim(),
  product_type: yup.string().required().trim(),
  prices: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        value: yup.number().required().min(0),
      })
    ),
  description: yup.string().required().trim(),
  aditional_detail: yup.string().trim(),
  measurement_unit: yup.string().trim(),
  cost: yup.number().min(0),
  tags: yup.array().of(yup.string().trim()),
  bulk_sale: yup.boolean().default(false),
  status: yup.boolean().default(true),
  iva: yup.string().trim(),
  ice: yup.string().trim(),
});

export const userSchema = yup.object().shape({
  business_name: yup.string().required().trim(),
  tradename: yup.string().trim(),
  user_type: yup.string().required().trim(),
  dni_type: yup.string().required().trim(),
  dni: yup.string().required().trim(),
  address: yup.string().required().trim(),
  phone_number: yup.string().required().trim(),
  email: yup.string().required().trim(),
  special_taxpayer: yup.boolean().default(false),
  aditional_information: yup.string().trim(),
});

export const paymentTypeSchema = yup.object().shape({
  name: yup.string().required().trim(),
});

export const userTypeSchema = yup.object().shape({
  name: yup.string().required().trim(),
});

export const taxSchema = yup.object().shape({
  name: yup.string().required().trim(),
  type: yup.string().required().trim(),
  description: yup.string().trim(),
  percentage: yup.number().required().min(1).max(100),
});

export const establishmentSchema = yup.object().shape({
  commercialName: yup.string().required().trim(),
  shortName: yup.string().required().trim(),
  code: yup
    .string()
    .required()
    .trim()
    .matches(/^[0-9]*$/, "Escriba solamente números"),
  logo: yup
    .mixed()
    // .required()
    .fileSize(2048)
    .fileFormat(validations.SUPPORTED_IMAGE_FORMATS),

  province: yup.string().required().trim(),
  city: yup.string().required().trim(),
  address: yup.string().required().trim(),
  phone: yup.string().required().trim(),
  email: yup.string().required().email().trim(),
});

export const emissionPointSchema = yup.object().shape({
  code: yup
    .string()
    .required()
    .trim()
    .matches(/^[0-9]*$/, "Escriba solamente números"),
  description: yup.string().required().trim(),
});

export const invoiceSchema = yup.object().shape({
  customer: yup.object().shape({
    reference: yup.string().trim(),
    address: yup.string().trim(),
    email: yup.string().trim(),
  }),
  emission_date: yup.date().required().max(moment().startOf("day")),
  emission_point: yup.string().required().trim(),
  referral_guide: yup.string().trim().nullable(),
  aditional_information: yup.string().trim(),
  credit: yup.object().shape({
    time_limit: yup.date().min(moment().startOf("day")),
    amount: yup.number().min(0).default(0),
  }),
  retentions: yup.object().shape({
    rental: yup.number().min(0).default(0),
    iva: yup.number().min(0).default(0),
  }),
});

export const paymentSchema = yup.object().shape({
  amount: yup.number().min(0).default(0).required(),
  method: yup.string().trim().required(),
  notes: yup.string().trim(),
  //payment_date: yup.date().required(),
});

export const issuedInvoiceSchema = yup.object().shape({
  provider: yup.string().trim().required(),
  emission_date: yup.date().required().max(moment().startOf("day")),
  max_payment_date: yup.date().required().max(moment().startOf("day")),
  invoice_number: yup.string().trim().required(),
  auth_number: yup.string().trim(),
  referral_guide: yup.string().trim().nullable(),
});
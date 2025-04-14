import * as yup from "yup";

const debtorYupValidator = yup.object().shape({
  user: yup
    .string()
    .required("User ID is required")
    .matches(/^[a-f\d]{24}$/i, "User ID must be a valid MongoDB ObjectId"),

  order: yup
    .string()
    .required("Order ID is required")
    .matches(/^[a-f\d]{24}$/i, "Order ID must be a valid MongoDB ObjectId"),

  products: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup
          .string()
          .required("Product ID is required")
          .matches(/^[a-f\d]{24}$/i, "Product ID must be a valid MongoDB ObjectId"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .integer("Quantity must be an integer")
          .min(1, "Quantity must be greater than 0"),
      })
    )
    .min(1, "Products must be an array with at least one item")
    .required("Products is required"),

  totalAmount: yup
    .number()
    .required("Total amount is required")
    .min(0, "Total amount cannot be negative"),

  status: yup
    .string()
    .oneOf(["pending", "paid", "overdue"], "Invalid status")
    .default("pending"),
});

export default debtorYupValidator;

import * as yup from "yup";

const orderYupValidator = yup.object().shape({
  userId: yup
    .string()
    .required("User ID is required")
    .matches(/^[a-f\d]{24}$/i, "User ID must be a valid MongoDB ObjectId"),

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
});

export default orderYupValidator;

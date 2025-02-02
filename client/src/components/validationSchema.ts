import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Email must be a valid Gmail address (e.g., user@gmail.com)"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required"),
  verificationCode: Yup.string().notRequired(), // No lo hacemos obligatorio por defecto
});

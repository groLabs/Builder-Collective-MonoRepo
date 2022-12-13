import * as yup from 'yup'

export const schema = yup.object({
  participants: yup.array().of(
    yup.object({
      name: yup.string(),
      address: yup.string(),
      token: yup
        .string()
        .matches(/^0x[a-fA-F0-9]{40}$/g, "Please enter a valid address")
        .required("This field is required"),
      amount: yup.string().required("This field is required"),
      value: yup.string().required("This field is required"),
      price: yup.string().required("This field is required"),
    })
  ),
});
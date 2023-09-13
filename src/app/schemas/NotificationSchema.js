import * as yup from 'yup';

export default yup.object({
  title: yup.string().required().trim(),
  text: yup.string().required().trim(),
}).noUnknown();
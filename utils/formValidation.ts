import { z } from 'zod';

//function that takes a Formdata object and a zod schema and validates the form data
export async function validateFormData<T extends z.ZodObject<any>>(formData: FormData, schema: T): Promise<z.infer<T>> {
  const formDataEntries = Object.fromEntries(formData.entries());
  const parsedFormData = schema.safeParse(formDataEntries);
  if (parsedFormData.success !== true) {
    throw new Error('Form validation failed');
  };
  return parsedFormData.data;
}

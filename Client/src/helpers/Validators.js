import * as Yup from "yup";

export const SignupValidations = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "password must be at most 20 characters long")
    .required("Password is required"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long")
    .required("Name is required"),
  age: Yup.number().integer("Age must be an integer").min(1, "Minimum age is 1").max(149, "Maximum age is 149").required("Age is required"),
  gender: Yup.string().oneOf(["male", "female"], "Invalid gender").required("Gender is required"),
  picture: Yup.mixed()
    .required("Picture is required")
    .test("fileType", "Invalid file format. Only JPG, JPEG, or PNG allowed.", value => {
      if (!value) return true;
      const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
      return supportedFormats.includes(value.type);
    }),
});

export const QuestionValidations = Yup.object().shape({
  text: Yup.string()
    .min(3, "Question must be at least 3 characters long")
    .max(100, "Question must be at most 100 characters long")
    .required("Title is required"),
  topicIds: Yup.array().of(Yup.number()).required("At least one topic is required").min(1, "At least one topic is required"),
});

export const UpdateProfileValidations = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters long")
    .required("Name is required"),
  age: Yup.number().integer("Age must be an integer").min(1, "Minimum age is 1").max(149, "Maximum age is 149").required("Age is required"),
  gender: Yup.string().oneOf(["male", "female"], "Invalid gender").required("Gender is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters long")
    .required("Password is required"),
});

export const UpdateAnswerValidations = Yup.object().shape({
  text: Yup.string()
    .min(3, "Text must be at least 3 characters long")
    .max(100, "Text must be at most 100 characters long")
    .required("Text is required"),
});

export const UpdateQuestionValidations = Yup.object().shape({
  text: Yup.string()
    .min(3, "Text must be at least 3 characters long")
    .max(100, "Text must be at most 100 characters long")
    .required("Text is required"),
});

export const UpdateTopicValidations = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long")
    .required("Title is required"),
  description: Yup.string()
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description must be at most 100 characters long")
    .required("Description is required"),
});

export const CreateTopicValidations = Yup.object().shape({
  title: Yup.string()
    .min(3, "title must be at least 3 characters long")
    .max(100, "title must be at most 100 characters long")
    .required("Title is required"),
  description: Yup.string()
    .min(3, "description must be at least 3 characters long")
    .max(100, "description must be at most 100 characters long")
    .required("Description is required"),
  picture: Yup.mixed()
    .required("Picture is required")
    .test("fileType", "Invalid file format. Only JPG, JPEG, or PNG allowed.", value => {
      if (!value) return true;
      const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
      return supportedFormats.includes(value.type);
    }),
});

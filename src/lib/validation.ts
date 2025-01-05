// lib/validation.ts
import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";

export const registerValidationSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": "نام کاربری باید از نوع رشته باشد",
    "string.min": "نام کاربری باید حداقل دارای سه کاراکتر باشد.",
    "string.max": "نام کاربری باید حداکثر دارای 20 کاراکتر باشد.",
    "any.required": "نام کاربری ضروری است.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "ایمیل معتبر نیست",
    "any.required": "ایمیل ضروری است",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "رمزعبور باید از نوع رشته ای باشد.",
    "string.min": "رمز عبور باید دارای حداقل 8 کاراکتر باشد.",
    "any.required": "رمزعبور ضروری است.",
  }),
});

export const validateRegister = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const { error } = registerValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      // بازگرداندن اولین پیام خطا یا لیست خطاها
      message: error.details.map((detail) => detail.message).join(", "),
      details: error.details.map((detail) => ({
        path: detail.path.join("."), // مسیر فیلد ولیدیشن‌شده
        message: detail.message, // پیام خطای مرتبط
      })),
    });
  }
  next();
};

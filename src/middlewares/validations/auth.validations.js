const joi = require("joi");
const APIError = require("../../utils/errors");

class authValidation {
  constructor() {}
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(3).max(50).required().messages({
            "string.base": "İsim alanı normal metin olmalıdır.",
            "string.empty": "İsim alanı boş olamaz!",
            "string.min": "İsim alanı en az 3 karakterden oluşmalıdır.",
            "string.max": "İsim alanı en fazla 50 karakterden oluşabilir.",
            "string.required": "İsim alanı zorunludur.",
          }),
          lastname: joi.string().trim().min(3).max(50).required().messages({
            "string.base": "Soyad alanı normal metin olmalıdır.",
            "string.empty": "Soyad alanı boş olamaz!",
            "string.min": "Soyad alanı en az 3 karakterden oluşmalıdır.",
            "string.max": "Soyad alanı en fazla 50 karakterden oluşabilir.",
            "string.required": "Soyad alanı zorunludur.",
          }),
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(50)
            .required()
            .messages({
              "string.base": "Email alanı normal metin olmalıdır.",
              "string.empty": "Email alanı boş olamaz!",
              "string.min": "Email alanı en az 3 karakterden oluşmalıdır.",
              "string.email": "Lütfen geçerli bir mail adresi giriniz",
              "string.max": "Email alanı en fazla 50 karakterden oluşabilir.",
              "string.required": "Email alanı zorunludur.",
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            "string.base": "Password alanı normal metin olmalıdır.",
            "string.empty": "Password alanı boş olamaz!",
            "string.min": "Password alanı en az 6 karakterden oluşmalıdır.",
            "string.max": "Password alanı en fazla 36 karakterden oluşabilir.",
            "string.required": "Password alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) {
        throw new APIError(error.details[0].message, 400);
      } else {
        throw new APIError("Lütfen validasyon kurallarına uyun", 400);
      }
    }
    next();
  };
  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(50)
            .required()
            .messages({
              "string.base": "Email alanı normal metin olmalıdır.",
              "string.empty": "Email alanı boş olamaz!",
              "string.min": "Email alanı en az 3 karakterden oluşmalıdır.",
              "string.email": "Lütfen geçerli bir mail adresi giriniz",
              "string.max": "Email alanı en fazla 50 karakterden oluşabilir.",
              "string.required": "Email alanı zorunludur.",
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            "string.base": "Password alanı normal metin olmalıdır.",
            "string.empty": "Password alanı boş olamaz!",
            "string.min": "Password alanı en az 6 karakterden oluşmalıdır.",
            "string.max": "Password alanı en fazla 36 karakterden oluşabilir.",
            "string.required": "Password alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message)
        throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lütfen validasyon kurallarına uyun", 400);
    }
    next();
  };
}

module.exports = authValidation;

const Joi = require('joi')

const voluntariosSchema = Joi.object({
    nome: Joi.string().min(2).required().messages({
        'string.empty': 'O nome do Voluntário é obrigatório',
        'string.min': 'O nome do Voluntário deve conter no mínimo 3 caracteres!'
    }),
    email: Joi.string().email().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required().messages({
        'string.empty': 'O email do voluntário é obrigatório!',
        'string.pattern.base': 'O email com formato inválido!'
    }),
    telefone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
        'string.empty': 'O telefone do voluntário é obrigatório!',
        'string.pattern.base': 'O telefone com formato inválido!'
    }),
    cidade: Joi.string().min(3).required().messages({
        'string.empty': 'A cidade do voluntário é obrigatória!',
        'string.min': 'A cidade do voluntário deve conter no mínimo 3 caracteres!'
    }),
    disponivel: Joi.boolean().required().messages({
        'boolean.base': 'A disponibilidade do voluntário é obrigatória!',
    }),
    habilidades_ids: Joi.array().items(Joi.number().integer()).required().messages({
        'array.base': 'As habilidades do voluntário são obrigatórias!',
    }),
});

const disponibilidadeSchema = Joi.object({
    disponivel: Joi.boolean().required().messages({
        'boolean.base': 'O campo disponivel deve ser true ou false!',
        'any.required': 'O campo disponivel é obrigatório!'
    })
});

const validarVoluntarios = (req, res, next) => {
    const { error } = voluntariosSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ erro: error.details.map(e => e.message) });
    }
    next();
};

const validarDisponibilidade = (req, res, next) => {
    const { error } = disponibilidadeSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ erro: error.details.map(e => e.message) });
    }
    next();
};

module.exports = { validarVoluntarios, validarDisponibilidade };

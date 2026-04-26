const Joi = require('joi');

const desabrigadosSchema = Joi.object({
    nome: Joi.string().min(2).required().messages({
        'string.empty': 'O nome do desabrigado é obrigatório',
        'string.min': 'O nome do desabrigado deve conter no mínimo 2 caracteres!'
    }),
    telefone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
        'string.empty': 'O telefone do desabrigado é obrigatório!',
        'string.pattern.base': 'O telefone com formato inválido!'
    }),
    num_pessoas: Joi.number().integer().min(1).required().messages({
        'number.base': 'O número de pessoas do desabrigado deve ser um número!',
        'number.integer': 'O número de pessoas do desabrigado deve ser um número inteiro!',
        'number.min': 'O número de pessoas do desabrigado deve ser no mínimo 1!',
        'number.empty': 'O número de pessoas do desabrigado é obrigatório!'
    }),
    abrigo_id: Joi.number().integer().required().messages({
        'number.base': 'O ID do abrigo do desabrigado deve ser um número!',
        'number.integer': 'O ID do abrigo do desabrigado deve ser um número inteiro!',
        'number.empty': 'O ID do abrigo do desabrigado é obrigatório!'
    }),
});

const validarDesabrigados = (req, res, next) => {        
    const { error } = desabrigadosSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ erro: error.details.map(e => e.message) });
    }
    next();
};

module.exports = { validarDesabrigados };
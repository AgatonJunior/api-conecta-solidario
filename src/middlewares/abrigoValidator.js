const Joi = require('joi');

const abrigoSchema = Joi.object ({
    nome: Joi.string().min(3).required().messages({
        'string.empty': 'O nome do abrigo é obrigatório',
        'string.min': 'O nome do abrigo deve conter pelo menos 3 caracteres',}),

    endereco: Joi.string().min(5).required().messages({
        'string.empty': 'O endereço do abrigo é obrigatório',
        'string.min': 'O endereço do abrigo deve conter pelo menos 5 caracteres',
    }),
    cidade: Joi.string().min(3).required().messages({
        'string.empty': 'A cidade do abrigo é obrigatória',
        'string.min': 'A cidade do abrigo deve conter pelo menos 3 caracteres',
    }),
    telefone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
        'string.empty': 'O telefone do abrigo é obrigatório',
        'string.pattern.base': 'O telefone do abrigo é inválido',
    }),
    capacidade: Joi.number().integer().min(0).required().messages({
        'number.base': 'A capacidade do abrigo deve ser um número',
        'number.integer': 'A capacidade do abrigo deve ser um número inteiro',
        'number.min': 'A capacidade do abrigo não pode ser negativa',
        'number.empty': 'A capacidade do abrigo é obrigatória',
    }),
    vagas_livres: Joi.number().integer().min(0).required().messages({
        'number.base': 'As vagas livres do abrigo devem ser um número',
        'number.integer': 'As vagas livres do abrigo devem ser um número inteiro',
        'number.min': 'As vagas livres do abrigo não podem ser negativas',
        'number.empty': 'As vagas livres do abrigo são obrigatórias',
    })
});

const validarAbrigo = (req, res, next) => {
    const { error } = abrigoSchema.validate(req.body, { abortEarly: false });

    if ( error ) {
        console.log('BODY RECEBIDA:', req.body);
        console.error(error)
      return res.status(400).json({ erro: error.details.map(e => e.message)
        });
    }
    next();
}

module.exports = validarAbrigo;
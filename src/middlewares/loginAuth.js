require('dotenv').config();
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({mensagem: 'Sem token!'})
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)
        req.resultado = decoded;

        next(); 
    } catch (error) {
        return res.status(401).json({mensagem: 'Token inválido'})
    } 
}

module.exports = {
    verificarToken
}
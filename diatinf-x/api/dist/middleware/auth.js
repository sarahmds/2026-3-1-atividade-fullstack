import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'dev-secret';
export function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({ message: 'Token não informado.' });
    try {
        const payload = jwt.verify(token, secret);
        req.userId = payload.userId;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}

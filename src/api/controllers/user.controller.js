const services = require('../services/user.services');
const authServices = require('../services/auth.services');

function isValidEmail(email) {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
}

function isValidFields(name, email, password) {
    if (!name || !email || !password) {
        return false;
    }
    return true;
}

exports.registerNewUser = async function registerNewUser(req, res) {
    const { name, email, password } = req.body;
    if (!isValidFields(name, email, password) || !isValidEmail(email)) {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    if (await services.findOneByEmail(email)) {
        return res.status(409).send({ message: 'Email already registered' });
    }
    
    try {
        await services.createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'user',
        });
        return res.status(201).send({ user: await services.findOneByEmail(email) });
    } catch (error) { res.status(500).send({ message: 'Internal error registerNewUser.' }); }
};

exports.registerNewAdmin = async function registerNewAdmin(req, res) {
    const data = authServices.decodeToken(req.headers.authorization);
    const { name, email, password } = req.body;
    if (!isValidFields(name, email, password) || !isValidEmail(email)) {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    try {
        if (data.role === 'admin') {
            await services.createUser({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: 'admin',
            });
            return res.status(201).send({ user: await services.findOneByEmail(req.body.email) });
        }
        return res.status(403).send({ message: 'Only admins can register new admins' });
    } catch (error) { res.status(500).send({ message: 'Internal error registerNewAdmin.' }); }
};
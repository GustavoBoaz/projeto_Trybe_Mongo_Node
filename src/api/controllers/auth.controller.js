const services = require('../services/auth.services');

function isValidEmail(email) {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
}

function isValidFields(email, password) {
    if (!email || !password) {
        return false;
    }
    return true;
}

exports.authUser = async function authUser(req, res) {
    const { email, password } = req.body;
    if (!isValidFields(email, password) || !isValidEmail(email)) {
        return res.status(401).send({ message: 'All fields must be filled' });
    }
    try {
        const user = await services.auth({
            email: req.body.email, password: req.body.password,
        });

        if (!user) {
            return res.status(401).send({ message: 'Incorrect username or password' });
        }
        return res.status(200).send({
            token: services.generateToken({
                id: user.id, email: user.email, role: user.role,
            }),
        });
    } catch (error) { res.status(500).send({ message: 'Internal server error.' }); }
};
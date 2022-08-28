exports.imageView = async function imageView(req, res) {
    try {
        res.header('Content-Type', 'image/jpeg');
        return res.status(200).send();
    } catch (error) { res.status(500).send({ message: 'Internal server error.' }); }
};
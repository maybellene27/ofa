const { connection } = require('mongoose')
const sanitize = require('mongo-sanitize')

module.exports = {
    getCurrentUser: () => async (req, res) => {
        const { User } = connection.models

        let { user } = req.session
        user = user ? user : req.user
        try {
            const entry = await User.findById(sanitize(user))
            if (!entry) {
                throw new Error('Document not found.')
            }
            res.status(200).json({
                entry
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    }
}
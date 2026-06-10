const db = require('../models');

const User = db.users;

const getUser = async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to fetch profile.' });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required.' });
        }

        const user = await User.findOne({ where: { refresh_token: refreshToken } });
        if (!user) {
            return res.status(204).send();
        }

        user.refresh_token = null;
        await user.save();
        return res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to logout.' });
    }
};

module.exports = {
    getUser,
    logout
};
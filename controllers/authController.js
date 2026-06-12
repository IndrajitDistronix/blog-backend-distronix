const bcrypt = require('bcrypt');
const db = require('../models');

const User = db.users;

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password });
        const refreshToken = user.generateRefreshToken();

        user.refresh_token = refreshToken;
        await user.save();
        const responseUser = user.toJSON();
        delete responseUser.password;
        return res.status(201).json({
            message: 'User registered successfully.',
            user: responseUser,
            accessToken: user.generateAccessToken(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to register user.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const passwordMatch = await user.validatePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refresh_token = refreshToken;
        await user.save();

        return res.status(200).json({
            message: 'Login successful.',
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to login.' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required.' });
        }

        const user = await User.findOne({ where: { refresh_token: refreshToken } });
        if (!user) {
            return res.status(403).json({ message: 'Refresh token not recognized.' });
        }

        const payload = user.verifyRefreshToken(refreshToken);
        if (!payload || payload.userId !== user.id) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        const accessToken = user.generateAccessToken();
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable to refresh token.' });
    }
};

module.exports = {
    register,
    login,
    refreshToken
};
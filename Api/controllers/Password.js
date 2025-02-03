const brevo = require('@getbrevo/brevo');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const ForgotPassword = require('../models/ForgotPassword');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1day" });
            const id = uuidv4();

            await user.createForgotPassword({ id, isActive: true });

            let defaultClient = brevo.ApiClient.instance;
            let apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.EMAIL_API_KEY;

            let apiInstance = new brevo.TransactionalEmailsApi();
            let sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = "click this link to reset password";
            sendSmtpEmail.textContent = `This token expires in two minutes http://localhost:5173/password/resetpassword/${id}/${token}`;

            sendSmtpEmail.sender = { email: "chhabiraniojha@gmail.com" };
            sendSmtpEmail.to = [
                { email }
            ];

            apiInstance.sendTransacEmail(sendSmtpEmail)
                .then(function (data) {
                    return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
                })
                .catch(function (error) {
                    throw new Error(error);
                });
        } else {
            throw new Error("User does not exist");
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    try {
        const forgotPasswordRequest = await ForgotPassword.findOne({ id });

        if (forgotPasswordRequest && forgotPasswordRequest.isActive) {
            forgotPasswordRequest.isActive = false; // Deactivate the request
            await forgotPasswordRequest.save();

            const user = jwt.verify(token, process.env.SECRET_KEY);
            if (user.id) {
                return res.status(201).json({ success: true, data: "validUser" });
            }
        } else {
            return res.status(401).json({ message: "Invalid or expired request" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { id, token } = req.params;
    const { password: newPassword } = req.body;

    try {
        const forgotPasswordRequest = await ForgotPassword.findOne({ id });

        if (forgotPasswordRequest) {
            const tokenVerification = jwt.verify(token, process.env.SECRET_KEY);
            if (tokenVerification.id) {
                const user = await User.findById(tokenVerification.id);

                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }

                    bcrypt.hash(newPassword, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }

                        user.password = hash;
                        user.save()
                            .then(() => {
                                return res.status(201).json({ message: 'Successfully updated the new password' });
                            })
                            .catch(err => {
                                throw new Error(err);
                            });
                    });
                });
            }
        }
    } catch (error) {
        return res.status(403).json({ error: error.message, success: false });
    }
};

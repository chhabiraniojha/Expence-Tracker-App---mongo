const brevo = require('@getbrevo/brevo');
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid');
const ForgotPassword = require('../models/ForgotPassword')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");






// Configure API key authorization: api-key


exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } })
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1day" })
            const id = uuidv4();
            user.createForgotPassword({ id, isActive: true })
                .catch(err => {
                    throw new Error(err)
                })
            let defaultClient = brevo.ApiClient.instance;

            let apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.EMAIL_API_KEY;

            let apiInstance = new brevo.TransactionalEmailsApi();
            let sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = "click this link to reset password";
            sendSmtpEmail.textContent = `This token expires in two minutes http://localhost:5173/password/resetpassword/${id}/${token}`;
            // sendSmtpEmail.htmlContent = `click this link <a href="">Reset password</a> to reset password`;

            sendSmtpEmail.sender = { email: "chhabiraniojha@gmail.com" };
            sendSmtpEmail.to = [
                { email }
            ];
            apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                // console.log('API called successfully. Returned data: ' + JSON.stringify(data));

                return res.status(200).json({ message: 'Link to reset password sent to your mail ', sucess: true })

            }, function (error) {
                throw new Error(error)
            });


        } else {
            throw new Error("user does not exist")
        }

    } catch (error) {
        throw new Error(error)
    }
}

exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    try {
        const forgotpasswordrequest = await ForgotPassword.findOne({ where: { id } })
        if (forgotpasswordrequest && forgotpasswordrequest.isActive) {
            if (!forgotpasswordrequest.isActive) {
                return res.status(401).json("user not found")
            } else {
                forgotpasswordrequest.update({ active: false});
                const user = jwt.verify(token, process.env.SECRET_KEY)
                if (user.id) {
                    res.status(201).json({success:true,data:"validUser"})
                }

            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }

    //     if(forgotpasswordrequest){
    //         forgotpasswordrequest.update({ active: false});
    //         res.status(200).send(`<html>
    //                                 <script>
    //                                     function formsubmitted(e){
    //                                         e.preventDefault();
    //                                         console.log('called')
    //                                     }
    //                                 </script>

    //                                 <form action="/password/updatepassword/${id}" method="get">
    //                                     <label for="newpassword">Enter New password</label>
    //                                     <input name="newpassword" type="password" required></input>
    //                                     <button>reset password</button>
    //                                 </form>
    //                             </html>`
    //                             )
    //         res.end()

    //     }
    // })
}


exports.updatePassword = async(req, res) => {
    const {id,token}=req.params;
    const newPassword=req.body.password.toString();
    
    try {
        const forgotpasswordrequest = await ForgotPassword.findOne({ where: { id } })
        if (forgotpasswordrequest) {
                const tokenVerification = jwt.verify(token, process.env.SECRET_KEY)
                if (tokenVerification.id) {
                    const user=await User.findByPk(tokenVerification.id)
                    // console.log(user.id)
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newPassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                return res.status(201).json({ message: 'Successfuly update the new password' })
                            })
                        });
                    });
                    
                }
            
        }
        // const { newpassword } = req.query;
        // const { resetpasswordid } = req.params;
        // ForgotPassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
        //     User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
        //         // console.log('userDetails', user)
        //         if (user) {
        //             //encrypt the password

        //             const saltRounds = 10;
        //             bcrypt.genSalt(saltRounds, function (err, salt) {
        //                 if (err) {
        //                     console.log(err);
        //                     throw new Error(err);
        //                 }
        //                 bcrypt.hash(newpassword, salt, function (err, hash) {
        //                     // Store hash in your password DB.
        //                     if (err) {
        //                         console.log(err);
        //                         throw new Error(err);
        //                     }
        //                     user.update({ password: hash }).then(() => {
        //                         res.status(201).json({ message: 'Successfuly update the new password' })
        //                     })
        //                 });
        //             });
        //         } else {
        //             return res.status(404).json({ error: 'No user Exists', success: false })
        //         }
        //     })
        // })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}
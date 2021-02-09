const db = require('../db/sequilize');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.user;
const { errorResponse, successResponse } = require('../utils/responses');

class AuthenticationController{
    static async register(req,res){
        try {
            const user = await User.create({
                name: req.body.name,
                password: bcrypt.hashSync(req.body.password, 8)
            });

            return successResponse(true, user, null, res);
        }catch (err) {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res

            );
        }
    }

    static async login(req, res){
        try {
            User.findOne({
                where: {name: req.body.name},
    
            }).then(user => {
                if (!user) {
                    return errorResponse(
                        false,
                        'User not found',
                        'User not found',
                        404, res);
                }
    
                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
                if (!passwordIsValid) {
                    return errorResponse(
                        false,
                        'Invalid Password',
                        'Invalid Password',
                        401,
                        res
                    );
                }    
    
               return successResponse(true, user, null, res);
    
            }).catch(err => {
                errorResponse(
                    false,
                    errorMessages.catchMessage,
                    err.toString(),
                    500,
                    res
    
                );
            });
        } catch (error) {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res

            );
        }
    }
}

module.exports = {
    register: AuthenticationController.register,
    login: AuthenticationController.login
};
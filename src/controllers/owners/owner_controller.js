const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Owner = db.owner;
const { errorResponse, successResponse } = require('../../utils/responses');

class OwnerController{
    static async create(req,res){
        try {
            const owner = await Owner.create({
                name: req.body.name,
                phone: req.body.phone
            });
            return successResponse(true, owner, null, res);
        }catch (err) {
            if(err instanceof Sequelize.ValidationError){
                return errorResponse(
                    false,
                    'Duplicate phone number',
                    err.errors[0].message,
                    401,
                    res
                );
            }
        }
    }

    static async showOwner(req, res){
        Owner.findOne({
            where: {
                id: req.params.id
            },
            
        }).then(owner => {
            if (owner === null) {
                return successResponse(false, 'Owner does not exist', null, res);
            }else {
                return successResponse(true, owner, null, res);
            }            
        }).catch(err => {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res

            );
        })
    }

    static async updateOwner(req, res) {
        try {
            const owner = await Owner.update({
                name: req.body.name,
                phone: req.body.phone
                },
                { where: { id: req.params.id } }
            );
            
            if (owner[0] === 0) {
                return successResponse(false, 'Owner does not exist', null, res);
            }else {
                return successResponse(true, 'Owner updated successfully', null, res);
            }
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

    static async deleteOwner(req, res) {
        try {
            const owner = await Owner.destroy(
                { where: { id: req.params.id } }
            );
            return successResponse(true, "Owner deleted successfully", null, res);
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
}

module.exports = {
    createOwner: OwnerController.create,
    showOwner: OwnerController.showOwner,
    updateOwner: OwnerController.updateOwner,
    deleteOwner: OwnerController.deleteOwner
};
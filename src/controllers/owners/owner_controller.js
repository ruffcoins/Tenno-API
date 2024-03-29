const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Owner = db.owner;
const { errorResponse, successResponse } = require('../../utils/responses');
const owners = require('../../models/owners');

class OwnerController {


    static async getAllOwners(req, res) {
        let offset = parseInt(req.query.skip);

        Owner.findAndCountAll({
            limit: 10,
            offset: offset
        }).then(owners => {
            return successResponse(
                true,
                owners,
                undefined,
                res
            );
        }).catch(err => {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res

            );
        });
    }

    static async create(req, res) {
        try {

            //check if phone number already exists in the owners table
            const existingOwner = await Owner.findOne({
                where: {
                    phone: req.body.phone
                }
            });

            if (existingOwner) {
                //return error response
                return errorResponse( false, 'Phone number belongs to another Owner', null, 600, res);
            }

            // check if phone number request is empty
            if (req.body.phone === '') {
                return errorResponse(false, 'Phone number can not be empty', null, 601, res);
            }


            const owner = await Owner.create({
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                occupation: req.body.occupation,
                sex: req.body.sex,
                state_of_origin: req.body.state_of_origin,
                town: req.body.town,
                lga: req.body.lga,
            });
            return successResponse(true, owner, null, res);

        } catch (err) {
            // return error response
            return errorResponse( false, 'Something went wrong', err.toString(), 500, res);
        }
    }

    static async showOwner(req, res) {
        Owner.findOne({
            where: {
                id: req.params.id
            },

        }).then(owner => {
            if (owner === null) {
                return successResponse(false, 'Owner does not exist', null, res);
            } else {
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
        });
    }

    static async updateOwner(req, res) {
        try {
            const owner = await Owner.update({
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                occupation: req.body.occupation,
                sex: req.body.sex,
                state_of_origin: req.body.state_of_origin,
                town: req.body.town,
                lga: req.body.lga,
            },
                { where: { id: req.params.id } }
            );

            // if owner does not exist

            if (owner[0] === 0) {
                return successResponse(false, 'Owner does not exist', null, res);
            } else {
                return successResponse(true, 'Owner updated successfully', null, res);
            }
        } catch (err) {
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
        } catch (err) {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res
            );
        }
    }

    static async searchOwners(req, res) {
        const { term } = req.query;

        Owner.findAll({
            where: {
                [Op.or]: {
                    name: { [Op.like]: '%' + term + '%' },
                    phone: { [Op.like]: '%' + term + '%' }
                }
            }
        }).then(owner => {
            return successResponse(
                true,
                owner,
                undefined,
                res
            );
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
}

module.exports = {
    createOwner: OwnerController.create,
    showOwner: OwnerController.showOwner,
    updateOwner: OwnerController.updateOwner,
    deleteOwner: OwnerController.deleteOwner,
    getAllOwners: OwnerController.getAllOwners,
    searchOwners: OwnerController.searchOwners
};
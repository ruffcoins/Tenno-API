const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Property = db.properties;
const Owner = db.owner;
const Room = db.rooms;
const Tenant = db.tenant;
const { errorResponse, successResponse } = require('../../utils/responses');
const { request } = require('../../../app');
const { tenant } = require('../../db/sequilize');

class TenantController{
    
    // Create
    static async createTenant(req, res) {

        try {
            
            // Find an owner by phone number
            const owner = await Owner.findOne({
                where:{
                    phone: req.body.phone
                }
            });

            // return successResponse(true, owner, null, res);

            if(!owner){
                return successResponse(false, 'Owner does not exist', null, res);
            }

            const property = await Property.findOne({
                where: {
                    owner_id: owner.id,
                    address: req.body.address
                }
            });
            if(!property){
                return successResponse(false, 'Property does not exist', null, res);
            }

            const room = await Room.findOne({
                where: {
                    property_id: property.id,
                    id: req.body.id,
                    available : true
                }
            });

            if(!room){
                return successResponse(false, 'Room does not exist or is not available', null, res);
            }

            Tenant.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone_number: req.body.phone_number,
                occupation: req.body.occupation,
                marital_status: req.body.marital_status,
                sex: req.body.sex
            }).then((tenant) => {
                
                Room.update({
                    tenant_id: tenant.id,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    duration: req.body.duration,
                    amount: req.body.amount,
                    available: false
                },
                    { where: { id: req.body.id } }
                );

                return successResponse(true, 'successful', null, res);
            }).catch((err)=>{
                if(err instanceof Sequelize.ValidationError){
                    return errorResponse(
                        false,
                        'Duplicate phone number',
                        err.errors[0].message,
                        401,
                        res
                    );
                }
            });

        } catch (err) {
            return errorResponse(
                false,
                'Something went wrong',
                error.toString(),
                500,
                res

            );
        }
    }


    // Read
    static async showRoom(req, res){

        try {
            const room = await Room.findOne({
                where: {
                    id: req.params.id
                },
            });
            
            if (!room) {
                return successResponse(false, 'Room does not exist', null, res);
            }

            const tenant = await Tenant.findOne({
                where: {
                    id: room.tenant_id
                },
            });

            if (!tenant) {
                return successResponse(false, 'Tenant does not exist', null, res);
            }

            return (successResponse(true, {room, tenant}, null, res))

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

    static async updateTenant(req, res) {
        try {

            const findRoom = await Room.findOne({
                where:{id: req.params.id}
            });

            if (findRoom) {
                const room = Room.update(
                    {
                        start_date: req.body.start_date,
                        end_date: req.body.end_date,
                        duration: req.body.duration,
                        amount: req.body.amount
                    },
                    { where: { id: findRoom.id } }
                ).then(room => {
                    Tenant.update(
                        {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            phone_number: req.body.phone_number,
                            occupation: req.body.occupation,
                            marital_status: req.body.marital_status,
                            sex: req.body.sex
                        },
                        { where: { id: room.tenant_id } }
                    );
                });
            }

            return successResponse(true, 'successful', null, res);

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
    createTenant: TenantController.createTenant,
    showRoom: TenantController.showRoom,
    updateTenant: TenantController.updateTenant
};
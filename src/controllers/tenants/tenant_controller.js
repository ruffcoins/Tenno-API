const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Property = db.properties;
const Owner = db.owner;
const Room = db.rooms;
const Tenant = db.tenant;
const { errorResponse, successResponse } = require('../../utils/responses');

class TenantController {

    // Get all tenants
    static async getAllTenants(req, res) {

        await Tenant.findAll({
            include: Room
        }).then(tenants => {
            return successResponse(
                true,
                tenants,
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

    // Create
    static async createTenant(req, res) {

        try {

            // Check if phone number exists
            const findTenant = await Tenant.findOne({
                where: { phone_number: req.body.phone_number }
            });

            if (findTenant) {
                return errorResponse(false, "Phone number already exists", null, 600, res);
            }

            // check if phone number request is empty
            if (req.body.phone_number === '') {
                return errorResponse(false, "Phone number can not be empty", null, 601, res);
            }

            // Find an owner by phone number
            const owner = await Owner.findOne({
                where: {
                    phone: req.body.phone
                }
            });

            if (!owner) {
                return successResponse(false, 'Owner does not exist', null, res);
            }

            const property = await Property.findOne({
                where: {
                    ownerId: owner.id,
                    address: req.body.address
                }
            });
            if (!property) {
                return successResponse(false, 'Property does not exist', null, res);
            }

            const room = await Room.findOne({
                where: {
                    propertyId: property.id,
                    id: req.body.id,
                    available: true
                }
            });

            if (!room) {
                return successResponse(false, 'Room does not exist or is not available', null, res);
            }

            Tenant.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone_number: req.body.phone_number,
                occupation: req.body.occupation,
                marital_status: req.body.marital_status,
                sex: req.body.sex,
                email: req.body.email,
                state_of_origin: req.body.state_of_origin,
                town: req.body.town,
                lga: req.body.lga,
                nok_first_name: req.body.nok_first_name,
                nok_last_name: req.body.nok_last_name,
                nok_phone_number: req.body.nok_phone_number,
                nok_email: req.body.nok_email,
                nok_address: req.body.nok_address,
                nok_relationship: req.body.nok_relationship

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

                return successResponse(true, 'Tenant created successfully', null, res);
            }).catch((err) => {
                return errorResponse(false, 'Something went wrong', err.toString(), 500, res);
            });

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

    // Read
    static async showRoom(req, res) {

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

            return (successResponse(true, { room, tenant }, null, res))

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

            const findTenant = await Tenant.findOne({
                where: { id: req.params.id }
            });

            if (findTenant) {
                Tenant.update(
                    {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone_number: req.body.phone_number,
                        occupation: req.body.occupation,
                        marital_status: req.body.marital_status,
                        sex: req.body.sex,
                        email: req.body.email,
                        state_of_origin: req.body.state_of_origin,
                        town: req.body.town,
                        lga: req.body.lga,
                        nok_first_name: req.body.nok_first_name,
                        nok_last_name: req.body.nok_last_name,
                        nok_phone_number: req.body.nok_phone_number,
                        nok_email: req.body.nok_email,
                        nok_address: req.body.nok_address,
                        nok_relationship: req.body.nok_relationship
                    }, {

                    where: { id: findTenant.id },

                }
                ).then(async (tenant) => {

                    await Room.update(
                        {
                            start_date: req.body.start_date,
                            end_date: req.body.end_date,
                            duration: req.body.duration,
                            amount: req.body.amount
                        },
                        { where: { tenant_id: findTenant.id } }
                    );
                });
            }

            return successResponse(true, 'Tenant updated Successfully', null, res);

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

    static async deleteTenant(req, res) {
        try {

            const findTenant = await Tenant.findOne({
                where: { id: req.params.id }
            });

            if (findTenant) {
                const tenantRoomId = await findTenant.getRoom({
                    attributes: ['id']
                });


                await Room.update(
                    {
                        available: true,
                        tenant_id: null,
                        amount: null,
                        duration: null,
                        start_date: null,
                        end_date: null
                    },
                    { where: { id: tenantRoomId.id } }
                );

                await Tenant.destroy(
                    { where: { id: req.params.id } }
                );
            }

            return successResponse(true, "Tenant deleted successfully", null, res);
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

    static async searchTenants(req, res) {
        const { term } = req.query;

        Tenant.findAll({
            where: {
                [Op.or]: {
                    first_name: { [Op.like]: '%' + term + '%' },
                    last_name: { [Op.like]: '%' + term + '%' },
                    phone_number: { [Op.like]: '%' + term + '%' },

                }
            }
        }).then(tenant => {
            return successResponse(
                true,
                tenant,
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
    createTenant: TenantController.createTenant,
    showRoom: TenantController.showRoom,
    updateTenant: TenantController.updateTenant,
    deleteTenant: TenantController.deleteTenant,
    getAllTenants: TenantController.getAllTenants,
    searchTenants: TenantController.searchTenants
};
const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Property = db.properties;
const Owner = db.owner;
const Room = db.rooms;
const { errorResponse, successResponse } = require('../../utils/responses');
const { all } = require('../../routes/notifications/notifications_route');

class PropertiesController {
    /** 
     * Create property controller
     * 
     * 
     * fetch all owners
     * when owner is selected, get the owner_id
     * Then store the property address 
     * Get the total quantity of rooms from the user input and store it as well
     * 
     * populate rooms table
     **/

    static async createProperty(req, res) {

        const roomArray = [];
        try {

            // Find an owner by phone number
            const owner = await Owner.findOne({
                where: {
                    phone: req.body.phone
                }
            });


            if (!owner) {
                return successResponse(false, 'Owner does not exist', null, res);
            }

            // If owner is found, create property using the owner id
            Property.create({
                address: req.body.address,
                ownerId: owner.id,
                no_of_rooms: req.body.no_of_rooms,
                description: req.body.description
            }).then((property) => {

                // After creating the property, create all the rooms attached to that property
                let roomName = '';
                for (let i = 0; i < req.body.rooms.length; i++) {
                    roomArray.push(req.body.rooms[i]);
                }

                for (let i = 0; i < roomArray.length; i++) {

                    for (let j = 0; j < roomArray[i].number; j++) {
                        if (!Number.isNaN(parseInt(roomArray[i].room_type.charAt(0), 10))) {
                            roomName = roomArray[i].room_type;
                        } else {
                            roomName = roomArray[i].room_type;  
                        }
                        Room.create({
                            propertyId: property.id,
                            room_type: roomArray[i].room_type,
                            room_name: `${roomName} (room ${j + 1})`

                        });
                    }
                }

                return successResponse(true, 'successful', null, res);
            }).catch((err) => {
                if (err instanceof Sequelize.ValidationError) {
                    return errorResponse(
                        false,
                        'Duplicate property address',
                        err.errors[0].message,
                        401,
                        res
                    );
                }
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

    static async showProperty(req, res) {

        const property = Property.findOne({
            where: {
                id: req.params.id
            },

        }).then(property => {
            if (!property) {
                return successResponse(false, 'Property does not exist', null, res);
            } else {
                return successResponse(true, property, null, res);
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

    static async deleteProperty(req, res) {
        try {
            const property = await Property.destroy(
                { where: { id: req.params.id } }
            );
            return successResponse(true, "Property deleted successfully", null, res);
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


    static async getAnOwnersProperties(req, res) {
        const { id } = req.query;
        try {
            const ownerProperty = await Owner.findAll({
                include: Property,
                where: {
                    id: id
                }
            });

            if (ownerProperty.length == 0) {
                return successResponse(
                    false,
                    "Owner doesn't exist",
                    null,
                    res
                );
            } else {
                return successResponse(
                    true,
                    ownerProperty[0].properties,
                    null,
                    res
                );
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

    static async allPropertiesWithTheirOwners(req, res) {

        try {
            const allProperties = await Property.findAll({
                include: Owner
            });

            return successResponse(
                true,
                allProperties,
                null,
                res
            );

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

    static async allPropertiesWithTheirOwnersAndRooms(req, res) {

        try {
            const allProperties = await Property.findAll({
                include: [Owner, Room]
            });

            return successResponse(
                true,
                allProperties,
                null,
                res
            );

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

    // Get all the rooms available in a property
    static async getAvailablePropertyRooms(req, res) {
        const { address } = req.query;
        try {
            const property = await Property.findOne({
                where: {
                    address: address
                }
            });
            if (!property) {
                return successResponse(false, 'Property does not exist', null, res);
            }

            const availableRooms = await Room.findAll({
                where: {
                    propertyId: property.id,
                    available: true
                }
            });

            return successResponse(
                true,
                availableRooms,
                null,
                res
            );
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

    static async searchProperties(req, res) {
        const { term } = req.query;

        Property.findAll({
            where: {
                [Op.or]: {
                    address: { [Op.like]: '%' + term + '%' },
                }
            }
        }).then(property => {
            return successResponse(
                true,
                property,
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

    static async allPropertiesWithVacantRooms(req, res) {

        try {
            const allPropertiesWithVacantRooms = await Property.findAndCountAll({
                include: [{
                    model: Room,
                    where: { available: 1 }
                }]
            });

            return successResponse(
                true,
                allPropertiesWithVacantRooms,
                null,
                res
            );

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

    static async getAllRooms(req, res) {

        try {
            const allRooms = await Room.findAndCountAll({
                include: [{ model: Property }]
            });

            return successResponse(
                true,
                allRooms,
                null,
                res
            );

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
}

module.exports = {
    createProperty: PropertiesController.createProperty,
    showProperty: PropertiesController.showProperty,
    deleteProperty: PropertiesController.deleteProperty,
    getAnOwnersProperties: PropertiesController.getAnOwnersProperties,
    getAvailablePropertyRooms: PropertiesController.getAvailablePropertyRooms,
    allPropertiesWithTheirOwners: PropertiesController.allPropertiesWithTheirOwners,
    allPropertiesWithTheirOwnersAndRooms: PropertiesController.allPropertiesWithTheirOwnersAndRooms,
    searchProperties: PropertiesController.searchProperties,
    allPropertiesWithVacantRooms: PropertiesController.allPropertiesWithVacantRooms,
    getAllRooms: PropertiesController.getAllRooms
};
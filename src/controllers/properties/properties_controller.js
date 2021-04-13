const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Property = db.properties;
const Owner = db.owner;
const Room = db.rooms;
const { errorResponse, successResponse } = require('../../utils/responses');

class PropertiesController{
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
                where:{
                    phone: req.body.phone
                }
            });

            
            if(!owner){
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
                for(let i = 0; i< req.body.rooms.length; i++){
                    roomArray.push(req.body.rooms[i]);
                }
            
                for(let i = 0; i< roomArray.length; i++){
                 
                    for(let j = 0; j< roomArray[i].number; j++){
                       if(!Number.isNaN(parseInt(roomArray[i].room_type.charAt(0), 10))){
                           roomName = roomArray[i].room_type;
                       }else{
                           roomName = roomArray[i].room_type.charAt(0);
                       }
                         Room.create({
                            property_id: property.id,
                            room_type: roomArray[i].room_type,
                            room_name: `${roomName}room${j+1}`
    
                        });
                    }
                }

                return successResponse(true, 'successful', null, res);
            }).catch((err)=>{
                if(err instanceof Sequelize.ValidationError){
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

    static async showProperty(req, res){
        
        const property = Property.findOne({
            where: {
                id: req.params.id
            },
            
        }).then(property => {
            if (!property) {
                return successResponse(false, 'Property does not exist', null, res);
            }else {
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


    static async getAnOwnersProperties(req, res) {

        try {
            const ownerProperty = await Owner.findAll({
                include: Property,
                where: {
                    id: req.body.id
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

    // Get all the rooms available in a property
    static async getAvailablePropertyRooms(req, res) {

        Room.findAndCountAll({
            attributes: ['id', 'room_type', 'room_name'],
        },
        {
            where: {
                address: req.body.address,
                available: true
            }
        }).then(rooms => {
            return successResponse(
                true,
                rooms,
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
}

module.exports = {
    createProperty: PropertiesController.createProperty,
    showProperty: PropertiesController.showProperty,
    deleteProperty: PropertiesController.deleteProperty,
    getAnOwnersProperties: PropertiesController.getAnOwnersProperties,
    getAvailablePropertyRooms: PropertiesController.getAvailablePropertyRooms,
    allPropertiesWithTheirOwners: PropertiesController.allPropertiesWithTheirOwners,
    searchProperties: PropertiesController.searchProperties
};
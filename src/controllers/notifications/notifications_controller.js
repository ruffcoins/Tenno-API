const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Room = db.rooms;
const { errorResponse, successResponse } = require('../../utils/responses');
const owners = require('../../models/notifications');

class NotificationsController{

    static async oneMonthToExpiryDate(req, res){
        const findRoom = await Room.findOne({
            where: {
            id: req.body.id
            }
        });

        if (findRoom) {
            console.log(findRoom);
        }
     }

}

module.exports = {
    oneMonthToExpiryDate: NotificationsController.oneMonthToExpiryDate
};
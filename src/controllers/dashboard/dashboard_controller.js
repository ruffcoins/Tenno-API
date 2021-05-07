const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Owner = db.owner;
const Property = db.properties;
const Room = db.rooms;
const Tenant = db.tenant;
const Notice = db.notice;
const Notification = db.notifications;
const { errorResponse, successResponse } = require('../../utils/responses');

class DashboardController {

    static async dashboard(req, res){

        
        // const ownerCount = 0;
        // const propertyCount = 0;
        // const roomCount = 0;
        // const tenantCount = ;

        //owners
        const ownerList = await Owner.findAndCountAll({
            
        });
        const ownerCount = ownerList.count;

        // properties
        const propertyList = await Property.findAndCountAll({
            
        });
        const propertyCount = propertyList.count;
        
        // rooms
        const roomList = await Room.findAndCountAll({
            
        });
        const roomCount = roomList.count;

        // Vacant Rooms
        const vacantRoomList = await Room.findAndCountAll({
            where: {
                available: 1
            }
        });
        const vacantRoomCount = vacantRoomList.count;

        // occupied Rooms
        const occupiedRoomList = await Room.findAndCountAll({
            where: {
                available: 0
            }
        });
        const occupiedRoomCount = occupiedRoomList.count;
        
        // tenants
        const tenantList = await Tenant.findAndCountAll({
            
        });
        const tenantCount = tenantList.count;

        // notices
        const noticeList = await Notice.findAndCountAll({

        });
        const noticeCount = noticeList.count;

        // notices
        const expiringList = await Notification.findAndCountAll({

        });
        const expiringCount = expiringList.count;

        return successResponse(true, { ownerCount, propertyCount, roomCount, tenantCount, noticeCount, expiringCount, vacantRoomCount, occupiedRoomCount}, null, res)
    }
}


module.exports = {
    dashboard: DashboardController.dashboard
};
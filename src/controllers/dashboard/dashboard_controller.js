const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Owner = db.owner;
const Property = db.properties;
const Room = db.rooms;
const Tenant = db.tenant;
const Notice = db.notice;
const Notification = db.notifications;
const { errorResponse, successResponse } = require('../../utils/responses');
const cron = require("node-cron");
const notifier = require('node-notifier');
const path = require('path');

class DashboardController {

    static async dashboard(req, res) {
        
        try {
            // create a cronjob to send notifications

            // run every day at 08:00:00, 12:00:00, 16:00:00, 20:00:00
            // cron.schedule("0 8,12,16,20 * * *", async () => {

            // run cronjob every 10 seconds
            cron.schedule("*/10 * * * * *", async () => {

                //get all rooms that have expiry dates less than 31 days but more than 14 days
                const roomsExpiringIn30Days = await Room.findAll({
                    where: {
                        end_date: {
                            [Sequelize.Op.lt]: new Date(new Date().setDate(new Date().getDate() + 31)),
                            [Sequelize.Op.gt]: new Date(new Date().setDate(new Date().getDate() + 14))
                        }
                    }
                });

                //
                // check if a 30-day notification already exists for each room in roomExpiringIn30Days list
                //
                roomsExpiringIn30Days.forEach(async element => {
                    const existing30DaysNotification = await Notification.findOne({
                        where: {
                            roomId: element.id,
                            title: "30-day notice"
                        }
                    });

                    // if there is no notification, create one
                    if (!existing30DaysNotification) {
                        const new30DaysNotification = await Notification.create({
                            roomId: element.id,
                            title: "30-day notice",
                            body: `${element.room_name}'s rent will expire in 30 days`
                        });

                        // create a notification popup
                        notifier.notify(
                            {
                                title: '30-day notice',
                                message: `${element.room_name}'s rent will expire in 30 days`,
                                appId: 'Tenno Inc',
                                icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
                                sound: true, // Only Notification Center or Windows Toasters
                                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                            },
                            function (err, response, metadata) {
                                // Response is response from notification
                                // Metadata contains activationType, activationAt, deliveredAt
                                console.log(err, response, metadata);
                            }
                        );
                    }
                });


                //get all rooms that have expiry dates less than 15 days but more than 1 day
                const roomsExpiringIn14Days = await Room.findAll({
                    where: {
                        end_date: {
                            [Sequelize.Op.lt]: new Date(new Date().setDate(new Date().getDate() + 15)),
                            [Sequelize.Op.gt]: new Date(new Date().setDate(new Date().getDate() + 1))
                        }
                    }
                });

                // check if a 14-day notification already exists for each room in roomsExpiringIn14Days list

                roomsExpiringIn14Days.forEach(async element => {
                    const existing14DaysNotification = await Notification.findOne({
                        where: {
                            roomId: element.id,
                            title: "14-day notice"
                        }
                    });

                    // if there is no notification, create one
                    if (!existing14DaysNotification) {
                        const new14DaysNotification = await Notification.create({
                            roomId: element.id,
                            title: "14-day notice",
                            body: `${element.room_name}'s rent will expire in 14 days`
                        });

                        // create a notification popup
                        notifier.notify(
                            {
                                title: '14-day notice',
                                message: `${element.room_name}'s rent will expire in 14 days`,
                                icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
                                sound: true, // Only Notification Center or Windows Toasters
                                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                            },
                            function (err, response, metadata) {
                                // Response is response from notification
                                // Metadata contains activationType, activationAt, deliveredAt
                                console.log(err, response, metadata);
                            }
                        );
                    }
                });

                //get all rooms that have expired
                const expiredRooms = await Room.findAll({
                    where: {
                        end_date: {
                            [Sequelize.Op.lt]: new Date()
                        }
                    }
                });

                // check if an expiry notification already exists for each room in expired room list

                expiredRooms.forEach(async element => {
                    const expiredNotification = await Notification.findOne({
                        where: {
                            roomId: element.id,
                            title: "Rent Expired"
                        }
                    });

                    // if there is no notification, create one
                    if (!expiredNotification) {
                        const newExpiredNotification = await Notification.create({
                            roomId: element.id,
                            title: "Rent Expired",
                            body: `${element.room_name}'s rent has expired`
                        });

                        // create a notification popup
                        notifier.notify(
                            {
                                title: 'Rent Expired',
                                message: `${element.room_name}'s rent has expired`,
                                icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
                                sound: true, // Only Notification Center or Windows Toasters
                                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                            },
                            function (err, response, metadata) {
                                // Response is response from notification
                                // Metadata contains activationType, activationAt, deliveredAt
                                console.log(err, response, metadata);
                            }
                        );
                    }
                });
            });


        } catch (e) {
            // return error response
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res
            );
        }

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
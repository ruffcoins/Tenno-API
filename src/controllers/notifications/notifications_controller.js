const fs = require('fs');
const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Room = db.rooms;
const Tenant = db.tenant;
const Owner = db.owner;
const Notification = db.notifications;
const Property = db.properties;
const Notice = db.notice;
const { errorResponse, successResponse } = require('../../utils/responses');

// New requirements
const cron = require("node-cron");
const notifier = require('node-notifier');

const path = require('path');

class NotificationsController {

    // static async createNotification(req, res) {

    //     try {
    //         // create a cronjob to send notifications

    //         // run every day at 08:00:00, 12:00:00, 16:00:00, 20:00:00
    //         // cron.schedule("0 8,12,16,20 * * *", async () => {
            
    //         // run cronjob every 10 seconds
    //         cron.schedule("*/10 * * * * *", async () => {
            
    //             //get all rooms that have expiry dates less than 31 days but more than 14 days
    //             const roomsExpiringIn30Days = await Room.findAll({
    //                 where: {
    //                     end_date: {
    //                         [Sequelize.Op.lt]: new Date(new Date().setDate(new Date().getDate() + 31)),
    //                         [Sequelize.Op.gt]: new Date(new Date().setDate(new Date().getDate() + 14))
    //                     }
    //                 }
    //             });

    //             //
    //             // check if a 30-day notification already exists for each room in roomExpiringIn30Days list
    //             //
    //             roomsExpiringIn30Days.forEach(async element => {
    //                 const existing30DaysNotification = await Notification.findOne({
    //                     where: {
    //                         roomId: element.id,
    //                         title: "30-day notice"
    //                     }
    //                 });

    //                 // if there is no notification, create one
    //                 if (!existing30DaysNotification) {
    //                     const new30DaysNotification = await Notification.create({
    //                         roomId: element.id,
    //                         title: "30-day notice",
    //                         body: `${element.room_name}'s rent will expire in 30 days`
    //                     });

    //                     // create a notification popup
    //                     notifier.notify(
    //                         {
    //                             title: '30-day notice',
    //                             message: `${element.room_name}'s rent will expire in 30 days`,
    //                             icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
    //                             sound: true, // Only Notification Center or Windows Toasters
    //                             wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    //                         },
    //                         function (err, response, metadata) {
    //                             // Response is response from notification
    //                             // Metadata contains activationType, activationAt, deliveredAt
    //                             console.log(err, response, metadata);
    //                         }
    //                     );
    //                 }
    //             });


    //             //get all rooms that have expiry dates less than 15 days but more than 1 day
    //             const roomsExpiringIn14Days = await Room.findAll({
    //                 where: {
    //                     end_date: {
    //                         [Sequelize.Op.lt]: new Date(new Date().setDate(new Date().getDate() + 15)),
    //                         [Sequelize.Op.gt]: new Date(new Date().setDate(new Date().getDate() + 1))
    //                     }
    //                 }
    //             });

    //             // check if a 14-day notification already exists for each room in roomsExpiringIn14Days list

    //             roomsExpiringIn14Days.forEach(async element => {
    //                 const existing14DaysNotification = await Notification.findOne({
    //                     where: {
    //                         roomId: element.id,
    //                         title: "14-day notice"
    //                     }
    //                 });

    //                 // if there is no notification, create one
    //                 if (!existing14DaysNotification) {
    //                     const new14DaysNotification = await Notification.create({
    //                         roomId: element.id,
    //                         title: "14-day notice",
    //                         body: `${element.room_name}'s rent will expire in 14 days`
    //                     });

    //                     // create a notification popup
    //                     notifier.notify(
    //                         {
    //                             title: '14-day notice',
    //                             message: `${element.room_name}'s rent will expire in 14 days`,
    //                             icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
    //                             sound: true, // Only Notification Center or Windows Toasters
    //                             wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    //                         },
    //                         function (err, response, metadata) {
    //                             // Response is response from notification
    //                             // Metadata contains activationType, activationAt, deliveredAt
    //                             console.log(err, response, metadata);
    //                         }
    //                     );
    //                 }
    //             });

    //             //get all rooms that have expired
    //             const expiredRooms = await Room.findAll({
    //                 where: {
    //                     end_date: {
    //                         [Sequelize.Op.lt]: new Date()
    //                     }
    //                 }
    //             });

    //             // check if an expiry notification already exists for each room in expired room list

    //             expiredRooms.forEach(async element => {
    //                 const expiredNotification = await Notification.findOne({
    //                     where: {
    //                         roomId: element.id,
    //                         title: "Rent Expired"
    //                     }
    //                 });

    //                 // if there is no notification, create one
    //                 if (!expiredNotification) {
    //                     const newExpiredNotification = await Notification.create({
    //                         roomId: element.id,
    //                         title: "Rent Expired",
    //                         body: `${element.room_name}'s rent has expired` 
    //                     });

    //                     // create a notification popup
    //                     notifier.notify(
    //                         {
    //                             title: 'Rent Expired',
    //                             message: `${element.room_name}'s rent has expired`,
    //                             icon: path.join(__dirname, 'assets/screen.png'), // Absolute path (doesn't work on balloons)
    //                             sound: true, // Only Notification Center or Windows Toasters
    //                             wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    //                         },
    //                         function (err, response, metadata) {
    //                             // Response is response from notification
    //                             // Metadata contains activationType, activationAt, deliveredAt
    //                             console.log(err, response, metadata);
    //                         }
    //                     );
    //                 }
    //             });
    //         });


    //     } catch (e) {
    //         // return error response
    //         return errorResponse(
    //             false,
    //             'Something went wrong',
    //             err.toString(),
    //             500,
    //             res
    //         );
    //     }
    // }

    static async getAllNotifications(req, res) {
        let notificationObject;
        let notificationBody;
        let completedNotification;
        let room;
        let property;
        let owner;
        let tenant;
        let notificationList = [];

        await Notification.findAll({
            attributes: ['id', 'title', 'body', 'roomId', 'completed', 'created_at', 'updated_at'],
            raw: true

        }).then(async (notifications) => {
            for (let i = 0; i < notifications.length; i++) {
                notificationObject = {
                    "id": 0,
                    "notificationsTitle": "",
                    "notificationsBody": "",
                    "roomName": "",
                    "tenantFirstName": "",
                    "tenantLastName": "",
                    "tenantPhone": "",
                    "propertyAddress": "",
                    "ownerName": "",
                    "completed": false,
                    "url": "127.0.0.1:3000/api/tenno/tenant/room/show/" + notifications[i].roomId
                }

                if (notifications[i].completed == 0) {
                    completedNotification = false
                } else {
                    completedNotification = true
                }

                if (notifications[i].title === "Rent Expired") {
                    notificationBody = `This room's rent has expired`
                } else if (notifications[i].title === "14-day notice") {
                    notificationBody = `This room's rent is expiring in 14 days`
                } else {
                    notificationBody = `This room's rent is expiring in 30 days`
                }

                notificationObject.id = notifications[i].id;
                notificationObject.notificationsTitle = notifications[i].title;
                notificationObject.notificationsBody = notificationBody;
                notificationObject.completed = completedNotification;

                room = await Room.findOne({
                    where: {
                        id: notifications[i].roomId
                    }

                }).then(async (room) => {
                    notificationObject.roomName = room.dataValues.room_name;
                    tenant = await Tenant.findOne({
                        where: {
                            id: room.dataValues.tenant_id
                        }
                    })
                    notificationObject.tenantFirstName = tenant.dataValues.first_name;
                    notificationObject.tenantLastName = tenant.dataValues.last_name;
                    notificationObject.tenantPhone = tenant.dataValues.phone_number;

                    property = await Property.findOne({
                        where: {
                            id: room.dataValues.propertyId
                        }
                    }).then(async (property) => {

                        notificationObject.propertyAddress = property.dataValues.address
                        owner = await Owner.findOne({
                            where: {
                                id: property.dataValues.ownerId
                            }
                        });
                        notificationObject.ownerName = owner.dataValues.name
                    });

                })
                notificationList.push(notificationObject);
            }

            return successResponse(
                true,
                notificationList,
                null,
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

    static async updateNotification(req, res) {
        try {
            const notificationtoUpdate = await Notification.findOne({
                where: {
                    id: req.params.id,
                }
            });

            if (!notificationtoUpdate) {
                return errorResponse(
                    false, 'Notification not found', 'Notification not found', 404, res
                );
            }

            if (notificationtoUpdate) {
                // check if notification is completed

                try {
                    if (notificationtoUpdate.completed === false) {
                        // update notification status to completed
                        console.log(notificationtoUpdate);

                        await notificationtoUpdate.update({
                            completed: true
                        });
                        // return success response
                        return successResponse(true, 'Notification updated Successfully', null, res);

                    }

                    if (notificationtoUpdate.completed === true) {
                        // update notification status to completed
                        return successResponse(
                            true, 'Notification has already been attended to', null, res // return success response
                        );
                    }
                    
                }
                catch (err) {
                    return errorResponse(
                        false, 'Something went wrong', err.toString(), 500, res
                    );
                }
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

    static async showAllCompletedNotifications(req, res) {

        let notificationObject;
        let notificationBody;
        let completedNotification;
        let room;
        let property;
        let owner;
        let tenant;
        let notificationList = [];

        await Notification.findAll({
            attributes: ['id', 'title', 'body', 'roomId', 'completed', 'created_at', 'updated_at'],
            where: {
                completed: true
            },
            raw: true

        }).then(async (notifications) => {
            for (let i = 0; i < notifications.length; i++) {
                notificationObject = {
                    "id": 0,
                    "notificationsTitle": "",
                    "notificationsBody": "",
                    "roomName": "",
                    "tenantFirstName": "",
                    "tenantLastName": "",
                    "tenantPhone": "",
                    "propertyAddress": "",
                    "ownerName": "",
                    "completed": false
                }

                if (notifications[i].completed == 0) {
                    completedNotification = false
                } else {
                    completedNotification = true
                }

                if (notifications[i].title === "Rent Expired") {
                    notificationBody = `This room's rent has expired`
                } else if (notifications[i].title === "14-day notice") {
                    notificationBody = `This room's rent is expiring in 14 days`
                } else {
                    notificationBody = `This room's rent is expiring in 30 days`
                }

                notificationObject.id = notifications[i].id;
                notificationObject.notificationsTitle = notifications[i].title;
                notificationObject.notificationsBody = notificationBody;
                notificationObject.completed = completedNotification;

                room = await Room.findOne({
                    where: {
                        id: notifications[i].roomId
                    }

                }).then(async (room) => {
                    notificationObject.roomName = room.dataValues.room_name;
                    tenant = await Tenant.findOne({
                        where: {
                            id: room.dataValues.tenant_id
                        }
                    })
                    notificationObject.tenantFirstName = tenant.dataValues.first_name;
                    notificationObject.tenantLastName = tenant.dataValues.last_name;
                    notificationObject.tenantPhone = tenant.dataValues.phone_number;

                    property = await Property.findOne({
                        where: {
                            id: room.dataValues.propertyId
                        }
                    }).then(async (property) => {

                        notificationObject.propertyAddress = property.dataValues.address
                        owner = await Owner.findOne({
                            where: {
                                id: property.dataValues.ownerId
                            }
                        });
                        notificationObject.ownerName = owner.dataValues.name
                    });

                })
                notificationList.push(notificationObject);
            }

            return successResponse(
                true,
                notificationList,
                null,
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

    static async showIncompleteNotifications(req, res) {

        let notificationObject;
        let notificationBody;
        let completedNotification;
        let room;
        let property;
        let owner;
        let tenant;
        let notificationList = [];

        await Notification.findAll({
            attributes: ['id', 'title', 'body', 'roomId', 'completed', 'created_at', 'updated_at'],
            where: {
                completed: false
            },
            raw: true

        }).then(async (notifications) => {
            for (let i = 0; i < notifications.length; i++) {
                notificationObject = {
                    "id": 0,
                    "notificationsTitle": "",
                    "notificationsBody": "",
                    "roomName": "",
                    "tenantFirstName": "",
                    "tenantLastName": "",
                    "tenantPhone": "",
                    "propertyAddress": "",
                    "ownerName": "",
                    "completed": false,
                    "url": "127.0.0.1:3000/api/tenno/tenant/room/show/" + notifications[i].roomId

                }

                if (notifications[i].completed == 0) {
                    completedNotification = false
                } else {
                    completedNotification = true
                }

                if (notifications[i].title === "Rent Expired") {
                    notificationBody = `This room's rent has expired`
                } else if (notifications[i].title === "14-day notice") {
                    notificationBody = `This room's rent is expiring in 14 days`
                } else {
                    notificationBody = `This room's rent is expiring in 30 days`
                }

                notificationObject.id = notifications[i].id;
                notificationObject.notificationsTitle = notifications[i].title;
                notificationObject.notificationsBody = notificationBody;
                notificationObject.completed = completedNotification;

                room = await Room.findOne({
                    where: {
                        id: notifications[i].roomId
                    }

                }).then(async (room) => {
                    notificationObject.roomName = room.dataValues.room_name;
                    tenant = await Tenant.findOne({
                        where: {
                            id: room.dataValues.tenant_id
                        }
                    })
                    notificationObject.tenantFirstName = tenant.dataValues.first_name;
                    notificationObject.tenantLastName = tenant.dataValues.last_name;
                    notificationObject.tenantPhone = tenant.dataValues.phone_number;

                    property = await Property.findOne({
                        where: {
                            id: room.dataValues.propertyId
                        }
                    }).then(async (property) => {

                        notificationObject.propertyAddress = property.dataValues.address
                        owner = await Owner.findOne({
                            where: {
                                id: property.dataValues.ownerId
                            }
                        });
                        notificationObject.ownerName = owner.dataValues.name
                    });

                })
                notificationList.push(notificationObject);
            }

            return successResponse(
                true,
                notificationList,
                null,
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

    // static async viewSingleNotification(req, res) {
    //     // get notification id
    //     let notificationId = req.params.id;

    //     // find notification
    //     await Notification.findOne({
    //         where: {
    //             id: notificationId
    //         }
    //     }).then(async (notification) => {
    //         if (notification) {

    //             await Room.findOne({
    //                 where: {
    //                     id: notification.roomId
    //                 }
    //             }).then(async (room) => {

    //                 await Tenant.findOne({
    //                     where: {
    //                         id: room.tenant_id
    //                     }
    //                 })
    //             })
    //         }
    //     }
    // )}
}

module.exports = {
    showAllCompletedNotifications: NotificationsController.showAllCompletedNotifications,
    updateNotification: NotificationsController.updateNotification,
    createNotification: NotificationsController.createNotification,
    getAllNotifications: NotificationsController.getAllNotifications,
    showIncompleteNotifications: NotificationsController.showIncompleteNotifications,

};
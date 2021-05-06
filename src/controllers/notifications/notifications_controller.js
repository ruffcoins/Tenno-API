const fs = require('fs');
const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Room = db.rooms;
const Tenant = db.tenant;
const Owner = db.owner;
const Notification = db.notifications;
const Property = db.properties;
const Notice = db.notice;
const Timeline = db.timeline;
const { errorResponse, successResponse } = require('../../utils/responses');
const { raw } = require('body-parser');
const { showProperty } = require('../properties/properties_controller');



class NotificationsController {

    static async showAllNotifications(req, res) {

        //Create today and yesterday's date
        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toDateString();

        // create a timeline
        // The timeline is used to check the date stored in the timeline
        // table against today's date. if the date doesn't match, look through
        // the list ot get current expiring rooms, if it does match, just get all
        // stored notifications

        let timeline = today.getFullYear() + " " + (today.getMonth() + 1) + " " + today.getDate();

        //Count the rows in the timeline table
        let noOfTimelines = await Timeline.findAll({
            attributes: [[db.sequelize.fn('count', db.sequelize.col('id')), 'count']],
            raw: true
        });

        // if theres no row, create one and put yesterday's date in it
        if (noOfTimelines[0].count == 0) {
            await Timeline.create({
                timeline: yesterday
            });
        }

        // Get the  maximum ID value (most recent) of the most recent timeline table 
        const maxId = await Timeline.findAll({
            attributes: [
                [db.sequelize.fn('MAX', db.sequelize.col('id')), 'id']
            ],
            raw: true,
        });

        // Find the row associated with the Maximum ID
        const maxIdRow = await Timeline.findOne({
            where: {
                id: maxId[0].id,
            }
        });

        if (maxIdRow) {

            const content = maxIdRow.timeline;

            processFile(content);
        }

        async function processFile(content) {


            if (content == timeline) {
                // do Nothing
                getAllNotifications();
            } else {
                await createNotification();

                content = await Timeline.create({
                    timeline: timeline
                });

                await getAllNotifications();
            }
        }


        async function createNotification() {
            await Room.findAll().then(async (rooms) => {

                rooms.forEach(async (room) => {
                    try {
                        if (room.available === false) {


                            const endDate = room.end_date;
                            const startDate = room.start_date;

                            let expiryDate = new Date(endDate);
                            // let beginDate = new Date(startDate);

                            let currentDate = new Date();
                            let todaysDate = new Date(currentDate);

                            //calculate time difference  
                            var current_time_difference = expiryDate.getTime() - todaysDate.getTime();
                            //calculate days difference by dividing total milliseconds in a day  
                            var remainingTime = current_time_difference / (1000 * 60 * 60 * 24);

                            if (remainingTime <= 0) {

                                // let expiry = successResponse(true, `This room's rent has expired `, null, res);
                                let expiry = `${room.room_name}\'s rent has expired `;

                                await Notification.create({
                                    title: "Expired",
                                    body: expiry,
                                    roomId: room.id
                                });

                            } else if (remainingTime <= 14 && remainingTime > 0) {

                                let expiry = `${room.room_name}\'s rent is expiring in 14 days`;

                                await Notification.create({
                                    title: "2 weeks notice",
                                    body: expiry,
                                    roomId: room.id
                                });

                            } else if (remainingTime <= 30 && remainingTime >= 14) {

                                let expiry = `${room.room_name}\'s rent is expiring in 30 days`

                                await Notification.create({
                                    title: "1 month notice",
                                    body: expiry,
                                    roomId: room.id
                                });
                            }

                        }

                    } catch (err) {

                        console.log(`inside error ${err}`);
                    }

                });


            });

            // return successResponse(true, "Notification Created Successfully", null, res);
        }

        async function getAllNotifications() {
            let notificationObject;
            let notificationBody;
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
                        "completed": false
                    }

                    if (notifications[i].title === "Expired") {
                        notificationBody = `This room's rent has expired`
                    } else if (notifications[i].title === "2 weeks notice") {
                        notificationBody = `This room's rent is expiring in 14 days`
                    } else {
                        notificationBody = `This room's rent is expiring in 30 days`
                    }


                    notificationObject.id = notifications[i].id;
                    notificationObject.notificationsTitle = notifications[i].title;
                    notificationObject.notificationsBody = notificationBody;
                    notificationObject.completed = notifications[i].completed;

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
    }


    static async updateNotification(req, res) {
        try {

            const findNotification = await Notification.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (findNotification) {
                Notification.update({
                    completed: true
                },
                    { where: { id: req.params.id } }

                ).then(async (notification) => {

                    await Notice.create(
                        {
                            title: findNotification.title,
                            notificationId: findNotification.id
                        }
                    );
                });
                return successResponse(true, 'Notification updated successfully', null, res);
            } else {
                return successResponse(false, 'Notification does not exist', null, res);
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

    // static async refreshNotification(req, res) {

    //     //Create today and yesterday's date
    //     let today = new Date();
    //     let yesterday = new Date(today);
    //     yesterday.setDate(yesterday.getDate() - 1);
    //     yesterday = yesterday.toDateString();

    //     let timeline = today.getFullYear() + " " + (today.getMonth() + 1) + " " + today.getDate();
    //     // let previousTimeline = yesterday.getFullYear() + " " + (yesterday.getMonth() + 1) + " " + yesterday.getDate();

    //     // console.log(previousTimeline);

    //     // Get the  maximum ID value (most recent) of the most recent timeline table 
    //     const maxId = await Timeline.findAll({
    //         attributes: [
    //             [db.sequelize.fn('MAX', db.sequelize.col('id')), 'id']
    //         ],
    //         raw: true,
    //     });

    //     // Find the row associated with the Maximum ID
    //     const maxIdRow = await Timeline.findOne({
    //         where: {
    //             id: maxId[0].id,
    //         }
    //     });

    //     if (maxIdRow && maxIdRow.timeline != yesterday) {
    //         await Timeline.destroy(
    //             { where: { id: maxIdRow.id } }
    //         );

    //         await createNotification();
    //         await getAllNotifications();

    //         Timeline.create({
    //             timeline: timeline
    //         });
    //     }

    //     async function createNotification() {
    //         await Room.findAll().then(async (rooms) => {

    //             rooms.forEach(async (room) => {
    //                 try {
    //                     if (room.available === false) {


    //                         const endDate = room.end_date;
    //                         const startDate = room.start_date;

    //                         let expiryDate = new Date(endDate);
    //                         // let beginDate = new Date(startDate);

    //                         let currentDate = new Date();
    //                         let todaysDate = new Date(currentDate);

    //                         //calculate time difference  
    //                         var current_time_difference = expiryDate.getTime() - todaysDate.getTime();
    //                         //calculate days difference by dividing total milliseconds in a day  
    //                         var remainingTime = current_time_difference / (1000 * 60 * 60 * 24);

    //                         if (remainingTime <= 0) {

    //                             // let expiry = successResponse(true, `This room's rent has expired `, null, res);
    //                             let expiry = `${room.room_name}\'s rent has expired `;

    //                             await Notification.create({
    //                                 title: "Expired",
    //                                 body: expiry,
    //                                 roomId: room.id
    //                             });

    //                         } else if (remainingTime <= 14 && remainingTime > 0) {

    //                             let expiry = `${room.room_name}\'s rent is expiring in 14 days`;

    //                             await Notification.create({
    //                                 title: "2 weeks notice",
    //                                 body: expiry,
    //                                 roomId: room.id
    //                             });

    //                         } else if (remainingTime <= 30 && remainingTime >= 14) {

    //                             let expiry = `${room.room_name}\'s rent is expiring in 30 days`

    //                             await Notification.create({
    //                                 title: "1 month notice",
    //                                 body: expiry,
    //                                 roomId: room.id
    //                             });
    //                         }

    //                     }

    //                 } catch (err) {

    //                     console.log(`inside error ${err}`);
    //                 }

    //             });


    //         });

    //         // return successResponse(true, "Notification Created Successfully", null, res);
    //     }

    //     async function getAllNotifications() {
    //         let notificationObject;
    //         let notificationBody;
    //         let room;
    //         let property;
    //         let owner;
    //         let tenant;
    //         let notificationList = [];

    //         await Notification.findAll({
    //             attributes: ['id', 'title', 'body', 'roomId', 'completed', 'created_at', 'updated_at'],
    //             raw: true

    //         }).then(async (notifications) => {
    //             for (let i = 0; i < notifications.length; i++) {
    //                 notificationObject = {
    //                     "id": 0,
    //                     "notificationsTitle": "",
    //                     "notificationsBody": "",
    //                     "roomName": "",
    //                     "tenantFirstName": "",
    //                     "tenantLastName": "",
    //                     "tenantPhone": "",
    //                     "propertyAddress": "",
    //                     "ownerName": "",
    //                     "completed": false
    //                 }

    //                 if (notifications[i].title === "Expired") {
    //                     notificationBody = `This room's rent has expired`
    //                 } else if (notifications[i].title === "2 weeks notice") {
    //                     notificationBody = `This room's rent is expiring in 14 days`
    //                 } else {
    //                     notificationBody = `This room's rent is expiring in 30 days`
    //                 }


    //                 notificationObject.id = notifications[i].id;
    //                 notificationObject.notificationsTitle = notifications[i].title;
    //                 notificationObject.notificationsBody = notificationBody;
    //                 notificationObject.completed = notifications[i].completed;

    //                 room = await Room.findOne({
    //                     where: {
    //                         id: notifications[i].roomId
    //                     }

    //                 }).then(async (room) => {
    //                     notificationObject.roomName = room.dataValues.room_name;
    //                     tenant = await Tenant.findOne({
    //                         where: {
    //                             id: room.dataValues.tenant_id
    //                         }
    //                     })
    //                     notificationObject.tenantFirstName = tenant.dataValues.first_name;
    //                     notificationObject.tenantLastName = tenant.dataValues.last_name;
    //                     notificationObject.tenantPhone = tenant.dataValues.phone_number;

    //                     property = await Property.findOne({
    //                         where: {
    //                             id: room.dataValues.propertyId
    //                         }
    //                     }).then(async (property) => {

    //                         notificationObject.propertyAddress = property.dataValues.address
    //                         owner = await Owner.findOne({
    //                             where: {
    //                                 id: property.dataValues.ownerId
    //                             }
    //                         });
    //                         notificationObject.ownerName = owner.dataValues.name
    //                     });

    //                 })
    //                 notificationList.push(notificationObject);
    //             }

    //             return successResponse(
    //                 true,
    //                 notificationList,
    //                 null,
    //                 res
    //             );
    //         }).catch(err => {
    //             return errorResponse(
    //                 false,
    //                 'Something went wrong',
    //                 err.toString(),
    //                 500,
    //                 res

    //             );
    //         });
    //     }

    // }

}

module.exports = {
    showAllNotifications: NotificationsController.showAllNotifications,
    updateNotification: NotificationsController.updateNotification,
    // refreshNotification: NotificationsController.refreshNotification
};
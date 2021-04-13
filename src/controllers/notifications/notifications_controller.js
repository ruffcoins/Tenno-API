const fs = require('fs');
const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Room = db.rooms;
const Notification = db.notifications;
const Notice = db.notice;
const Timeline = db.timeline;
const { errorResponse, successResponse } = require('../../utils/responses');
const { raw } = require('body-parser');

class NotificationsController {

    static async showAllNotifications(req, res) {

        let noticeList = [];

        let today = new Date();
        let timeline = today.getFullYear() + " " + (today.getMonth() + 1) + " " + today.getDate();

        //Count the rows in the timeline table
        let noOfTimelines = await Timeline.findAll({
            attributes: [[db.sequelize.fn('count', db.sequelize.col('id')), 'count']],
            raw: true
        });

        // itf theres no row, create one
        if (noOfTimelines[0].count == 0) {
            await Timeline.create({
                timeline: timeline
            });
        }

        // Get the  macimum ID value (most recent) of the most recent database entry
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

        function processFile(content) {

            if (content == timeline) {
                // do Nothing
                getAllNotifications();
            } else {
                getAllNotificationsAndSaveInDatabase();

                Timeline.create({
                    timeline: timeline
                });
            }
        }


        function getAllNotificationsAndSaveInDatabase() {
            Room.findAll().then((rooms) => {

                rooms.forEach(room => {
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

                                // let expiry = successResponse(true, `${room.room_name}\'s rent has expired `, null, res);
                                let expiry = `${room.room_name}\'s rent has expired `;
                                noticeList.push(expiry);

                                const notification = Notification.create({
                                    title: "Expired",
                                    body: expiry,
                                    roomId: room.id
                                });

                            } else if (remainingTime <= 14 && remainingTime > 0) {

                                let expiry = `${room.room_name}\'s rent is expiring in 14 days`;
                                noticeList.push(expiry);

                                const notification = Notification.create({
                                    title: "2 weeks notice",
                                    body: expiry,
                                    roomId: room.id
                                });

                            } else if (remainingTime <= 30 && remainingTime >= 14) {

                                let expiry = `${room.room_name}\'s rent is expiring in 30 days`
                                noticeList.push(expiry);

                                const notification = Notification.create({
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

                return successResponse(true, noticeList, null, res);
            });
        }

        function getAllNotifications() {

            Notification.findAndCountAll({
                attributes: ['id', 'title', 'body', 'roomId', 'completed', 'created_at', 'updated_at'],
            }).then(notifications => {
                return successResponse(
                    true,
                    notifications,
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
                    completed: req.body.completed
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

}

module.exports = {
    showAllNotifications: NotificationsController.showAllNotifications,
    updateNotification: NotificationsController.updateNotification
};
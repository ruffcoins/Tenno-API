const fs = require('fs');
const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Room = db.rooms;
const Notification = db.notifications;
const { errorResponse, successResponse } = require('../../utils/responses');
// const owners = require('../../models/notifications');

class NotificationsController {

    static async showAllNotifications(req, res) {

        let noticeList = [];

        // fs.readFile("timeline.txt", 'utf8', function(err, data) {
        //     if (err) throw err;
        //     // console.log('OK: ' + timeline.txt);
        //     console.log(data)
        //   });

        // let timeline = new Date();
        const tommorrow = new Date();

        tomorrow.setDate(new Date().getDate() - 1);

        console.log(tomorrow);

        // fs.writeFile('timeline.txt', `${timeline}`, function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        //   });

        Room.findAll().then((rooms) => {

            rooms.forEach(room => {
                try {
                    if (room.available === false) {


                        const endDate = room.end_date;
                        let expiryDate = new Date(endDate);

                        let currentDate = new Date();
                        let todaysDate = new Date(currentDate);

                        let remainingTime = expiryDate.getDate() - todaysDate.getDate();


                        if (remainingTime <= 0) {

                            // let expiry = successResponse(true, `${room.room_name}\'s rent has expired `, null, res);
                            let expiry = `${room.room_name}\'s rent has expired `;
                            noticeList.push(expiry);

                        } else if (remainingTime <= 14 && remainingTime > 0) {
                            
                            // let expiry = successResponse(true, `${room.room_name}\'s rent is expiring in ${Math.abs(remainingTime)} days`, null, res);
                            let expiry = `${room.room_name}\'s rent is expiring in ${Math.abs(remainingTime)} days`;
                            noticeList.push(expiry);

                        } else if (remainingTime <= 30 && remainingTime >= 15) {
                            
                            // let expiry = successResponse(true, `${room.room_name}\'s rent is expiring in ${Math.abs(remainingTime)} days`, null, res);
                            let expiry = `${room.room_name}\'s rent is expiring in ${Math.abs(remainingTime)} days`
                            noticeList.push(expiry);

                        } 

                    }

                } catch (err) {

                    console.log(`inside error ${err}`);
                }

            });

            return successResponse(true, noticeList, null, res);
        });

    }

    static async createNotification(req, res) {

        

    }

    static async expiredRoom(req, res) {

        Room.findAll().then((rooms) => {
            rooms.forEach(room => {

                try {
                    if (room.available === false) {

                        const endDate = room.end_date;
                        let expiryDate = new Date(endDate);

                        let currentDate = new Date();
                        let todaysDate = new Date(currentDate);

                        let remainingTime = expiryDate.getDate() - todaysDate.getDate();


                        if (remainingTime <= 0) {
                            console.log("This room\'s rent has expired");
                        } else {
                            console.log("No notification for this room at this time");
                        }

                    }

                } catch (err) {

                    console.log(`inside error ${err}`);
                }

            });
        });

    }

}

module.exports = {
    showAllNotifications: NotificationsController.showAllNotifications
};
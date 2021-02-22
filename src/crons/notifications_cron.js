const cron = require('node-cron');
const db = require('../db/sequilize');
const { errorResponse, successResponse } = require('../utils/responses');
const Room = db.rooms;

/**
 * Logic for this class is this. There are two fields in the db current blah blah and previous blah blah
 * the current should always be bigger than the previous so every 1am the cron job runs and updates the current
 * and puts the old current value in the previous. A backup cron job will run every 3am and check if the current
 * is greater than the previous if it's not that means the first cron job failed to do it's work. So it the backup does
 * what its supposed to do
 */
class NotificationsCron{
    /**update the current_loan_amount_added_interest with the new value and the previous_loan_amount_added_interest
     * with the old value every 1am
     */

     oneMonthToExpiryDate(){
         cron.schedule('* * * * * *', () => {// every one second * * * * * *

            Room.findAll().then((rooms)=>{
                    rooms.forEach(room => {

                        try {
                            if (room.available === false) {

                                const endDate = room.end_date;
                                let expiryDate = new Date(endDate);

                                let currentDate = new Date();
                                let todaysDate = new Date(currentDate) ;

                                let remainingTime = expiryDate.getDate() - todaysDate.getDate();
                            

                                if (remainingTime === 30) {
                                console.log("This room\'s rent is expiring in 30 days");
                                   
                                } else if (remainingTime === 14) {
                                    console.log("This room\'s rent is expiring in 14 days");
                                } else if (remainingTime === 0) {
                                    console.log("This room\'s rent has expired");
                                } else if (remainingTime < 0) {
                                    console.log("This room's rent is " + Math.abs(remainingTime) + " days past expiration");
                                } else {
                                    console.log("No notification for this room at this time");
                                }
                                
                            }
                            
                        } catch (err) {

                            console.log(`inside error ${err}`);
                        }
                        
                    });
            });
         })
        // const findRoom = Room.findOne({
        //     where: {
        //     id: req.body.id
        //     }
        // });

        // if (findRoom) {
        //     console.log(findRoom);
        // }
     }
    //  addDailyInterest(){
    //     cron.schedule('0 0 * * *', () => {//every 1am 0 9 * * *  every one second * * * * * *
    //         console.log(Date.getDate());
    //         CustomerLoans.count().then(count =>{
    //             if(count > 0){

    //             }
    //         })
    //     }, {
    //         timezone: 'America/Sao_Paulo' //4 hours behind Nigeria
    //     });
    // }

    /**
     * this is the backup for the cron this will check every 3am if the
     * current_loan_amount_added_interest is greater than the previous_loan_amount_added_interest
     * if it's not it should add to the current_loan_amount_added_interest and to the previous
     */
    // checkDailyInterest(){
    //      cron.schedule('0 3 * * *',  () => {
    //             CustomerLoans.count().then(count =>{
    //                 if(count > 0){

    //                 }
    //             })
    //      },{
    //          timezone: 'America/Sao_Paulo'
    //      })
    // }
}


module.exports = NotificationsCron;


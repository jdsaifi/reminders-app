const moment = require('moment');
// let timeArr = '09:30'.split(':');
// console.log(timeArr)
// console.log(moment('2019-11-24'))
// let _date = moment('24/11/2019');
// console.log(_date.add(timeArr[0], 'h'))
// console.log(_date.add(timeArr[1], 'm'))
// console.log(moment('2019-11-24').add(timeArr[0], 'h').add(timeArr[1], 'm').format('X'))
function isValidDate(d) { return d instanceof Date && !isNaN(d); }

module.exports.scheduleTime = (date, time) => {
    // To-Do: fix Date(today, tomorrow, this weekend), time(morning, afternoon, evening, night)
    /**
     * ..........
     * ..........
     * ..........
     */

    // Convert Dates
    switch(date){
        case 'today':
            date = moment().format('YYYY-MM-DD')
            break;
        case 'tomorrow':
            date = moment().add(1, 'd').format('YYYY-MM-DD')
            break;
    }

    // Convert Times
    switch(time){
        case 'morning':
            time = '09:00'
            break;
        case 'afternoon':
            time = '12:00'
            break;
        case 'evening':
            time = '17:00'
            break;
        case 'night':
            time = '21:00'
            break;
    }

    if(isValidDate(new Date(date))){
        let _date = moment(date);
        let timeArr = time.split(':');
        _date.add(timeArr[0] || 0, 'h');
        _date.add(timeArr[1] || 0, 'm');

        // console.log(_date);
        // console.log(_date.toDate());
        // console.log(_date.utc());
        // return;

        return {
            convertedInputs: {
                date,time
            },
            date: _date.utc(),
            unix: _date.unix()
        }
    }else{
        return null;
    }
}
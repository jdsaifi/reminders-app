import moment from 'moment';

const partsOfDate = ['Today', 'Tomorrow'];
const partsOfTime = ['Morning', 'Afternoon', 'Evening', 'Night'];
const TIME_SHIFTS = {
    'morning':      {start: 5,  end: 11, fixed: 9},
    'afternoon':    {start: 12, end: 16, fixed: 12},
    'evening':      {start: 17, end: 20, fixed: 17},
    'night':        {start: 21, end: 4,  fixed: 21},
};

export const TIME_PICKER_TIME_INTERVALS = 15;

export const isAccessToken = () => {
    const token = sessionStorage.getItem('reminderapp::access_token');

    if(token === null){
        return false;
    }else{
        return token
    }
}

export const BASE_URL = '/';

export const partsOfTheDay = () => {
    /*
        morning: 9 am
        afternoon: 12 pm
        evening: 5 pm
        night: 9 pm
    */
    const parts = partsOfTime; //['Morning', 'Afternoon', 'Evening', 'Night'];
    const hour  = new Date().getHours();
    let shift;
    if(hour >= 5  && hour <= 11) shift = 0 // Morning;
    if(hour >= 12 && hour <= 16) shift = 1 // Afternoon;
    if(hour >= 17 && hour <= 20) shift = 2 // Evening;
    if(hour >= 21 || hour <= 4) shift = 3 // Night;

    return parts.filter( (val, indx) => indx>=shift );
}

export const validateDateTime = (date, time) => {    
    let inputDate = date;
    let inputTime = time;
    let fixedTimeing24H = {};

    if(partsOfDate.includes(date)){
        switch(date){
            case 'Today':
                date = moment().format('YYYY-MM-DD');
                break;
            case 'Tomorrow':
                date = moment().add(1, 'd').format('YYYY-MM-DD');
        }
    }

    console.log("check if date is today: ", )

    if(partsOfTime.includes(time)){
        const currentHour  = new Date().getHours();
        // let currentHour = 3;
        let plusOneHourInCurrentHour = currentHour + 1;
    
        let hourForPart = null;
        switch(time){
            case 'Morning':
                    hourForPart = TIME_SHIFTS.morning.fixed;
                    if( (
                        currentHour >= TIME_SHIFTS.morning.start &&
                        currentHour <= TIME_SHIFTS.morning.end
                    ) && (
                        plusOneHourInCurrentHour >= TIME_SHIFTS.morning.start &&
                        plusOneHourInCurrentHour <= TIME_SHIFTS.morning.end
                    ) && moment().isSame(date, 'd') ){
                        hourForPart = plusOneHourInCurrentHour
                    }
                    fixedTimeing24H = {'h': hourForPart, 'm': '00'};
                break;
            case 'Afternoon':
                    hourForPart = TIME_SHIFTS.afternoon.fixed;
                    if( (
                        currentHour >= TIME_SHIFTS.afternoon.start &&
                        currentHour <= TIME_SHIFTS.afternoon.end
                    ) && (
                        plusOneHourInCurrentHour >= TIME_SHIFTS.afternoon.start &&
                        plusOneHourInCurrentHour <= TIME_SHIFTS.afternoon.end
                    ) && moment().isSame(date, 'd') ){
                        hourForPart = plusOneHourInCurrentHour
                    }
                    fixedTimeing24H = {'h': hourForPart, 'm': '00'};
                break;
            case 'Evening':
                    hourForPart = TIME_SHIFTS.evening.fixed;
                    if( (
                        currentHour >= TIME_SHIFTS.evening.start &&
                        currentHour <= TIME_SHIFTS.evening.end
                    ) && (
                        plusOneHourInCurrentHour >= TIME_SHIFTS.evening.start &&
                        plusOneHourInCurrentHour <= TIME_SHIFTS.evening.end
                    ) && moment().isSame(date, 'd') ){
                        hourForPart = plusOneHourInCurrentHour
                    }
                    fixedTimeing24H = {'h': hourForPart, 'm': '00'};
                break;
    
            case 'Night':
                    hourForPart = TIME_SHIFTS.night.fixed;               
                    if( (
                        currentHour >= TIME_SHIFTS.night.start &&
                        currentHour <= TIME_SHIFTS.night.end
                    ) && (
                        plusOneHourInCurrentHour >= TIME_SHIFTS.night.start &&
                        plusOneHourInCurrentHour <= TIME_SHIFTS.night.end
                    ) && moment().isSame(date, 'd') ){
                        hourForPart = plusOneHourInCurrentHour
                    }
                    
                    fixedTimeing24H = {'h': hourForPart, 'm': '00'};
                break;
        }
    }else{
        let arr = time.split(':');
        fixedTimeing24H = {'h': arr[0] || 0, 'm': arr[1] || 0};
    }

    let targetDate = moment(date)
    .add(fixedTimeing24H.h, 'h')
    .add(fixedTimeing24H.m, 'm')

    return {
        status: moment().isBefore(targetDate),
        inputs: {
            date: inputDate, time: inputTime
        },
        converted: {
            date, time: `${fixedTimeing24H.h}:${fixedTimeing24H.m}`
        }
    }


}
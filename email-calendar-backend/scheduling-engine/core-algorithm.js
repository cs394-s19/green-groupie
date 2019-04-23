//import { database } from "firebase";
let moment = require('moment');

module.exports = {
    // Divide free chunks into free time slots where each slot is the length of the meeting.
    divideChunks: function divideChunks(userDefs){
        let meeting= []
        const events = getEventsList()
        const duration = events['duration']
        const freeChunks = getFreeChunks(events, userDefs)
        freeChunks.forEach(element => {
            let start = stringToDate(element.str)
            let end = stringToDate(element.end)
            let gap = end - start
            if (gap < duration){
                return
            }
            if (start % 300000 !== 0){
                let temp_start = (start / 300000 + 1) * 300000
                if (end - temp_start >= duration){
                    start = temp_start
                }
            }
            let slot = parseInt(gap/30, 10)
            for (let i = 0; i < slot; i++){
                let startTime = start + 300000*i 
                if (startTime + duration <= end){
                    meeting.push({
                        str: dateToString(startTime),
                        end: dateToString(startTime + duration)
                    })
                }
            }
        });
        return meeting
    },
}


function getEventsList() {
    return [{end: {dateTime: "2019-04-15T09:00:00-05:00"},
            start: {dateTime: "2019-04-15T08:00:00-05:00"}},
            {end: {dateTime: "2019-04-17T21:33:00-05:00"},
            start: {dateTime: "2019-04-17T21:00:00-05:00"}}]
            // {end: {dateTime: "2019-04-17T10:30:00-05:00"},
            // start: {dateTime: "2019-04-17T07:00:00-05:00"}}]
    // {end: {dateTime: "2019-04-24T08:40:00-05:00"}, start: {dateTime: "2019-04-T22:10:00-05:00"}}]
            // {end: {dateTime: "2019-04-24T15:33:00-05:00"}, start: {dateTime: "2019-04-24T14:00:00-05:00"}},
            // {end: {dateTime: "2019-04-01T15:55:00-05:00"}, start: {dateTime: "2019-04-01T14:10:00-05:00"}},
            // {end: {dateTime: "2019-04-02T07:00:00-05:00"}, start: {dateTime: "2019-04-01T20:20:00-05:00"}},
            // // {end: {date: "2017-03-28"}, start: {date: "2017-03-26"}}
            // {end: {dateTime: "2019-04-17T17:10:00-05:00"}, start: {dateTime: "2019-04-17T08:40:00-05:00"}},
            // {end: {dateTime: "2019-04-18T07:55:00-05:00"}, start: {dateTime: "2019-04-18T06:15:00-05:00"}},
            // {end: {dateTime: "2019-04-26T18:45:00-05:00"}, start: {dateTime: "2019-04-26T17:06:00-05:00"}}]
}

// function findSlots(freeSlots) {
//     console.log('ITS HERE')
//     const chunks = getUserDefs()
//     const freeChunks = getFreeChunks(chunks);
//     const proposedSlots = divideChunks(freeChunks);
//     proposedSlots.forEach(function (proposedSlot) {
//         if (JSON.stringify(proposedSlot) in freeSlots) {
//             freeSlots[JSON.stringify(proposedSlot)] = freeSlots[JSON.stringify(proposedSlot)] +1;
//         }
//         else {
//             freeSlots[JSON.stringify(proposedSlot)] = 1;
//         }
//     });
//     return freeSlots
// }

//import events from '../../src/components/Pages/Profile/_ProfilePageTest';


// findSlots(getUserDefs())

// function findSlots(freeSlots) {
//     console.log('ITS HERE')
//     const chunks = getUserDefs()
//     const freeChunks = getFreeChunks(chunks);
//     const proposedSlots = matchChunks(freeChunks);
//     proposedSlots.forEach(function (proposedSlot) {
//         if (JSON.stringify(proposedSlot) in freeSlots) {
//             freeSlots[JSON.stringify(proposedSlot)] = freeSlots[JSON.stringify(proposedSlot)] +1;
//         }
//         else {
//             freeSlots[JSON.stringify(proposedSlot)] = 1;
//         }
//     });
//     return freeSlots
// }



// function getUserDefs(){
//     // get code from the front end
//     return JSON.parse(data)
// }

function getFBInfo(){
    return 
}

// function getUserDefs() {
//     // make firebase request to get user definitions
//     return {
//         daily_str: '09:00:00',
//         daily_end: '21:00:00',
//         str: '2019-04-15T09:00:00-05:00',
//         end: '2019-04-15T21:00:00-05:00',
//         duration: 30

//     }
// }

function getTotalChunks(events, userDefs) {
    let totalChunks = [];
    const window = userDefs;
    let curr_ev = events[0];
    const last_event = events[events.length - 1];
    if (events) {
        if (curr_ev.start.dateTime > window.str) {
            totalChunks.push({str: window.str, end: curr_ev.start.dateTime});
        }
        if (window.end > last_event.end.dateTime) {
            totalChunks.push({str: last_event.end.dateTime, end: window.end});
        }
        if (events.length >=2) { events.forEach(function (event) {
            if (curr_ev !== event) {
                if (curr_ev.end.dateTime < event.start.dateTime) {
                    if (window.end >= event.start.dateTime) {
                        totalChunks.push({str:curr_ev.end.dateTime, end: event.start.dateTime});
                    }
                    else {}
                    curr_ev = event;
                }
                else {
                    curr_ev = event;
                }
            }

        })}
      }
    return totalChunks
}

function getFreeChunks(events, userDefs) {
    const freeChunks = [];
    const totalChunks = getTotalChunks(events, userDefs);
    //console.log(totalChunks);
    const window = userDefs;
    totalChunks.forEach(function(chunk) {
        let day_str = chunk.str.split('T')[0];
        let day_end = chunk.end.split('T')[0];
        let timezone = chunk.str.split('-').pop();
        // let daily_str = new Date(day_str + "T" + window.daily_str + "-" + timezone);
        let daily_str = moment(day_str + "T" + window.daily_str + "-" + timezone);
        let abs_str = moment(day_str + "T" + window.daily_str + "-" + timezone);
        // let daily_end = new Date(day_end + "T" + window.daily_end + "-" + timezone);
        let daily_end = moment(day_end + "T" + window.daily_end + "-" + timezone);
        let abs_end = moment(day_end + "T" + window.daily_end + "-" + timezone);
        //console.log(daily_str.format());
        //console.log(daily_end.format());
        if (daily_str.date() === daily_end.date()) {
            if ((chunk.end <= daily_str.format()) || (chunk.str >= daily_end.format())) {
                // ignore
            }
            else {
                if((chunk.str >= daily_str.format()) && (chunk.end <= daily_end.format())) {
                    //    new chunk, starting at chunk str, ending at chunk end
                    freeChunks.push({str: chunk.str, end: chunk.end})
                }
                else if ((chunk.str < daily_str.format()) && (chunk.end <= daily_end.format())) {
                    //    new chunk, starting at daily str, ending at chunk end
                    freeChunks.push({str: daily_str.format(), end: chunk.end})
                }
                else if ((chunk.end > daily_end.format()) && (chunk.str >= daily_str.format())) {
                    //    new chunk, starting at chunk str, ending at daily end
                    freeChunks.push({str: chunk.str , end: daily_end.format()})
                }
                else {
                    //    new chunk, starting at daily str, ending at daily end
                    freeChunks.push({str: daily_str.format() , end: daily_end.format()})
                }
            }

        }
        else {
        //    split chunk into daily pieces, for each piece, only get part within daily window
            let day;
            for (day = daily_str.date(); day <= daily_end.date(); day++ ) {
                //console.log(day);
                let temp_start =  abs_str.date(day);
                let temp_end =  abs_end.date(day);
                if (day === daily_str.date()) {
                    // console.log(chunk.str);
                    // console.log(daily_str);
                    if (chunk.str <= daily_str.format()) {
                        //    new chunk, starting at daily str, ending at daily end
                        freeChunks.push({str: temp_start.format(), end: temp_end.format()})
                    }
                    else if (chunk.str >= temp_end.format()) {

                    }
                    else {
                        //    new chunk, starting at chunk str, ending at daily end
                        freeChunks.push({str: chunk.str, end: temp_end.format()})
                    }
                }
                else if (day === daily_end.date()) {
                    if (chunk.end < temp_start.format()) {
                        // ignore
                    }
                    else if (chunk.end > temp_end.format()) {
                        //    new chunk, starting at daily str, ending at daily end
                        freeChunks.push({str: temp_end.format(), end: temp_end.format()})
                    }
                    else {
                        //    new chunk, starting at daily str, ending at chunk end
                        freeChunks.push({str: temp_start.format(), end: chunk.end})
                    }
                }
                else {
                    //    new chunk, starting at daily str, ending at daily end
                    freeChunks.push({str: temp_start.format(), end: temp_end.format()})
                }
            }
        }
    });
    return freeChunks
}


function stringToDate(x){
    // Take a string of DateTime format and convert it to JS object of Date relative to universal Time
    
    // var date = x.split('-')[0]
    // date = Date(date)
    // return date.getTime()

    let tempDate = new Date(x)
    console.log('the argument is', x)
    let date = x.split('T')[0]
    let time = x.split('T')[1]
    console.log('time is', time)

    let timeParts = time.split('-')[0].split(':')
    let dateParts = date.split('-')
    let realDate = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1])
    console.log('the realdate is', realDate)
    console.log('the universal time is', realDate.getTime())
    console.log('the original time is', tempDate.getTime()) 
    return realDate.getTime()
}

function dateToString(x){
    var d = new Date(0)
    d.setUTCSeconds(x)
}





//Store the person's free timeslots into Firebase
function storeFirebase(){
    
}




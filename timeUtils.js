export const getTimeFor = (timerName, timeValue) => {
    const month = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const timers = {
        start: new Date(timeValue),
        end: new Date(timeValue),
        spend: new Date(timeValue)
    }

    return `
        ${timers[timerName].getDate()} 
        ${month[timers[timerName].getMonth()]} 
        ${timers[timerName].getFullYear()}  
        ${timers[timerName].getHours()}:${timers[timerName].getMinutes()}
    `
}
const { UptimeCheck } = require('./lib/uptime');

( async () => {
    const robot = new UptimeCheck() // init class
    robot.humanify([{ 
        "cache-control": "no-cache"
    }]) // used user agents at the request
    
    await robot.checkIfUp().catch((err) =>{ // check if website is accessable
        console.log('oops..:', err)
    }) 

    console.log(robot.status) // see status information
})()
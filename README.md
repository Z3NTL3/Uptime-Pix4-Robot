# Uptime Pix4
A uptime robot for Pix4 services

# Example
```js
const { UptimeCheck } = require("uptime-pix4");

( async () => {
    const robot = new UptimeCheck() // init class
    robot.humanify([{ 
        "cache-control": "no-cache"
    }]) // used user agents at the request
    await robot.checkIfUp() // check if website is accessable

    console.log(robot.status) // see status information
})()
```
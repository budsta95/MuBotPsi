const fetch = require("node-fetch");

const wakeUpDyno = (url, interval = 5, callback) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {
        try { 
            // HTTP GET request to the dyno's url
            fetch(url).then(() => console.log(`Fetching ${url}.`)); 
        }
        catch (err) { // catch fetch errors
            console.error(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
        }
        finally {
            try {
                callback(); // execute callback, if passed
            }
            catch (e) { // catch callback error
                callback ? console.error("Callback failed: ", e.message) : null;
            }
            finally {
                // do it all again
                return wakeUpDyno(url, interval, callback);
            }
        }
    }, milliseconds);
};

module.exports = wakeUpDyno;
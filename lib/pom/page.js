const {Builder} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const service = new firefox.ServiceBuilder('./drivers/geckodriver.exe');
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
module.exports = class Page {
    
    driver = new Builder().forBrowser("firefox").setFirefoxService(service).build();

    //Check duplicates in arr
    async hasDuplicates(arr) {
        const answ =  new Set(await arr).size !== arr.length;
        if (answ) {
            console.log("Duplicate elements found.");
        }
        else {
            console.log("No Duplicates found.");
        }
        return answ
    }

    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open (path) {
        return this.driver.get(`http://automationpractice.com/${path}`); 
    }
}

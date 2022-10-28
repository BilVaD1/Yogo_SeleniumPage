const ListingPage = require('../../lib/pom/productListing.page')
const myAssert = require('../../lib/helpers/myAssertions')

describe("Verify product Listing Page", function() {
    
    beforeAll(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
    });

    beforeEach(async function() {
        await ListingPage.open()
    });

    afterEach(async function() {
        await ListingPage.driver.close()
    })




    xit("with a displaying banner", async function() {
        let answer = await (await ListingPage.getBannerText()).getText()
        console.log(answer)
        expect(answer).toBe('Women')
    });

    xit("verify Size(iFrame)", async function() {  //iFrame, scroll, executeScript
        await (await ListingPage.selectSize('S')).click()
        await ListingPage.driver.sleep(15000)
        let answer = await myAssert.checkSizes('S')
        expect(answer).toBe(true)
    });

    it("verify Color", async function() {
        const {until, By} = require('selenium-webdriver');
        await ListingPage.selectColor('White', 'Black')
        await ListingPage.driver.wait(until.elementLocated(By.id(`enabled_filters`)), 20000);
        let variableForCheck = await myAssert.allProductsHaveColor_v2('white', 'black')
        expect(variableForCheck).toBe(true)
    });

    xit("verify Range", async function() {
        await ListingPage.selectRange(30)
        await ListingPage.driver.sleep(10000)
    });

    xit("verify sort by(Slider)", async function() {
        await ListingPage.sortByText('Price: Lowest first')
        await ListingPage.driver.sleep(10000)
    });

  });
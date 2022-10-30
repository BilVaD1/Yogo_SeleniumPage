const ListingPage = require('../../lib/pom/productListing.page')
const myAssert = require('../../lib/helpers/myAssertions')
const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');
chai.use(chaiMatchPattern);
const _ = chaiMatchPattern.getLodashModule();

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
        await ListingPage.selectSize('S')
        await ListingPage.handleFiltersBlock()
        let answer = await myAssert.checkSizes('S')
        expect(answer).toBe(true)
    });

    xit("verify Color", async function() {
        await ListingPage.selectColor('White', 'Black')
        await ListingPage.handleFiltersBlock()
        let variableForCheck = await myAssert.allProductsHaveColor_v2('white', 'black')
        expect(variableForCheck).toBe(true)
    });

    xit("verify Range", async function() {
        await ListingPage.selectRange(30)
        await ListingPage.handleFiltersBlock()
        let lowPrice = (await ListingPage.getPriceRange())[0]
        let highPrice = (await ListingPage.getPriceRange())[1]
        let prices = await ListingPage.getPricesOfItems()
        for(let price of prices){
            chai.expect(price).isBetween(lowPrice, highPrice);
        }
        
    });

    it("verify sort by(Slider)", async function() {
        await ListingPage.sortByText('Price: Lowest first')
        await ListingPage.loadingFinish()
        let prices = await ListingPage.getPricesOfItems()

        //console.log(prices, myAssert.determineOrder(prices))
        expect(myAssert.determineOrder(prices)).toBe('ascending')

    });

  });
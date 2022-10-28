const Page = require('./page');
const {Key, By, until} = require('selenium-webdriver');

class ListingPage extends Page { 

    async getBannerText (){
        return this.driver.findElement(By.className("category-name"))
    }

    async selectSize (size){
        switch (size){
            case 'S':
                this.size = 1
                break
            case 'M':
                this.size = 2
                break
            case 'L':
                this.size = 3
                break
        }
        return this.driver.findElement(By.css(`#ul_layered_id_attribute_group_1 li:nth-child(${this.size}) input`))
    }

    async selectColor (){
        let colors = await this.driver.findElements(By.css('#ul_layered_id_attribute_group_3 li'))
        for(let el of colors){
            let text = await el.getText()
            for(let argument of arguments)
            switch (text.includes(argument)){
                case true:
                    el.findElement(By.css('input')).click()  // Searching within the el
                    break
            }
        }
    }

    async getProductColors (index){
        return await this.driver.findElements(By.css(`.product_list.grid.row li.ajax_block_product:nth-child(${index}) ul.color_to_pick_list li a`))
    }

    async getAllProducts (){
        return await this.driver.findElements(By.css('.product_list.grid.row li.ajax_block_product'))
    }

    async getProduct (index){
        return await this.driver.findElement(By.css(`.product_list.grid.row li.ajax_block_product:nth-child(${index}) img`))
    }

    async selectRange (x_left = 0, x_right = 0){
        let el_left = await this.driver.findElement(By.css(".layered_slider_container a:nth-child(2)"))
        let el_right= await this.driver.findElement(By.css(".layered_slider_container a:nth-child(3)"))
        
        for (let i = 1; i <= x_left ; i++) {
            el_left.sendKeys(Key.ARROW_RIGHT);
        }

        for (let i = 1; i <= x_right ; i++) {
            el_right.sendKeys(Key.ARROW_LEFT);
        }
    }

    async sortBy (index){
        let select = await this.driver.findElement(By.xpath("//select"))
        await select.click()
        let option = await this.driver.findElement(By.xpath(`//select/option[${index}]`))
        await option.click()
    }

    async sortByText (...args){
        let select = await this.driver.findElement(By.xpath("//select"))
        await select.click()
        let options = await this.driver.findElements(By.xpath(`//select/option`))
        first: for(let option of options){  // Использую метку first так как тут не надо выбирать несколько значений как это было в selectColor
            let option_text = await option.getText()
            for(let arg of args){
                switch (option_text.includes(arg)){
                    case true:
                        await option.click() 
                        break first
                }
            }
        }
    }

    async selectQuickMenu (index){
        let product = await this.getProduct(index)
        await this.driver.executeScript("arguments[0].scrollIntoView()",product)
        await this.driver.actions({ bridge:true}).move({x: 0, y: 0, origin: product}).perform()
        await this.driver.sleep(3000)
        await this.driver.findElement(By.xpath(`(//a[@class='quick-view'])[${index}]`)).click()
        let parentWindow = await this.driver.getWindowHandle() // Handled Frame
        await this.driver.wait(until.ableToSwitchToFrame(0), 20000);
        await this.driver.wait(until.elementLocated(By.id('image-block')), 20000);
        return parentWindow
    }

    async open () {
        await super.open('index.php?id_category=3&controller=category'); //Обращается через супер к классу родителю т.е. Page и использует path
    }
}

module.exports = new ListingPage();
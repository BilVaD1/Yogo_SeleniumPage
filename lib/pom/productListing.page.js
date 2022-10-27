const Page = require('./page');
const {Key, By, TouchSequence} = require('selenium-webdriver');

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

    // Метод для проверки цветов в списке продуктов, если выбран один продукт
    async productsHaveColor (linkColor){
        let products = await this.getAllProducts()
        let checkList = []
        first: for(let el in products){
            let index = +el + 1
            let colors = await this.getProductColors(index)
            console.log(`Checking the ${index} product`)
            for(let color of colors){
                let checker = await color.getAttribute('href')
                console.log(checker)
                switch (checker.includes(linkColor)){
                    case true:
                        checkList.push(checker)
                        continue first
                }
            }
        }
        switch (checkList.length == products.length){
            case true:
                console.log(`The qty of items with ${linkColor} color(${checkList.length}) is equal to the qty of all items in the product grid(${products.length})`)
                return true
            case false:
                console.log(`The qty of items with ${linkColor} color(${checkList.length}) is NOT equal to the qty of all items in the product grid(${products.length})`)
                return false
        }
    }


     // Метод для проверки цветов в списке продуктов, если выбран один продукт или больше продуктов
     async allProductsHaveColor_v2 (...args){
        let products = await this.getAllProducts()  // Получаем все продукты которые находятся в списке
        let checkList = []   // Создаем пустой список в который будем помещать продукты которые имеют хотя бы один цвет из args
        // Создаем цикл в котором перебираю все продукты из products по индексу
        first: for(let el in products){   // Использую метку first для того чтобы не добавлять дважды продукт в checkList если он имеет два или более выбранных цвета в args
            let index = +el + 1  // Добавляю единицу ко всем индексам ел-ов из products чтобы они не начинались с ед.
            let colors = await this.getProductColors(index) // Нахожу все опции цветов продукта в списке продуктов
            console.log(`Checking the ${index} product`)
            // Создаем цикл в котором перебираю все цвета из colors, и ищу в нем значения из args
            for(let color of colors){
                let checker = await color.getAttribute('href')
                console.log(checker)
                for(let linkColor of args){ // Подставляю каждое значение из args в checker чтобы найти совпадения
                    switch (checker.includes(linkColor)){
                        case true:
                            checkList.push(checker) // Если совпадение найдено то возвращаю его в checkList
                            continue first  // Использую метку first чтобы елси продукт имеет два или более цвета из args не добавлять его по несколько раз в args
                    }
                }
            }
        }
        //Находим название аргументов переданных в функцию чтобы переиспользовать их в ответе функции
        let argsNames = []
        args.forEach(el => argsNames.push(el));
        // Ответ который возвращает функция
        switch (checkList.length == products.length){      // Проверяем совпадает ли длина всех елеметнов при выборе цветового фильтра(ов) с длинной полученных ел-ов с указааным цветом
            case true:
                console.log(`The qty of items with ${argsNames} color(${checkList.length}) is equal to the qty of all items in the product grid(${products.length})`)
                return true
            case false:
                console.log(`The qty of items with ${argsNames} color(${checkList.length}) is NOT equal to the qty of all items in the product grid(${products.length})`)
                return false
        }
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



    async open () {
        await super.open('index.php?id_category=3&controller=category'); //Обращается через супер к классу родителю т.е. Page и использует path
    }
}

module.exports = new ListingPage();
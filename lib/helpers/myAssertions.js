const ListingPage = require('../pom/productListing.page')
const {By, until} = require('selenium-webdriver');

class myAssert {

    async checkSizes (...args){
        let products = await ListingPage.getAllProducts()
        let checkList = []
        first: for(let el in products){  
            let index = +el + 1
            let parentWindow = await ListingPage.selectQuickMenu(index)
            await ListingPage.driver.wait(until.elementLocated(By.id(`group_1`)), 30000);
            await ListingPage.driver.findElement(By.id("group_1")).click()
            let sizes = await ListingPage.driver.findElements(By.xpath("//select/option"))
            console.log(`Checking the ${index} product`)
            for(let size of sizes){
                let checker = await size.getText()
                for(let givenSize of args){
                    switch (checker.includes(givenSize)){
                        case true:
                            checkList.push(checker)
                            await ListingPage.driver.switchTo().window(parentWindow) // Swithcing frame
                            await ListingPage.driver.findElement(By.css('a[title="Close"]')).click()
                            continue first  
                    }
                }
            }
        }
        let argsNames = []
        args.forEach(el => argsNames.push(el));
        // Ответ который возвращает функция
        switch (checkList.length == products.length){      // Проверяем совпадает ли длина всех елеметнов при выборе цветового фильтра(ов) с длинной полученных ел-ов с указааным цветом
            case true:
                console.log(`The qty of items with ${argsNames} size(${checkList.length}) is equal to the qty of all items in the product grid(${products.length})`)
                return true
            case false:
                console.log(`The qty of items with ${argsNames} size(${checkList.length}) is NOT equal to the qty of all items in the product grid(${products.length})`)
                return false
        }
    }


    // Метод для проверки цветов в списке продуктов, если выбран один продукт или больше продуктов
    async allProductsHaveColor_v2 (...args){
        let products = await ListingPage.getAllProducts()  // Получаем все продукты которые находятся в списке
        let checkList = []   // Создаем пустой список в который будем помещать продукты которые имеют хотя бы один цвет из args
        // Создаем цикл в котором перебираю все продукты из products по индексу
        first: for(let el in products){   // Использую метку first для того чтобы не добавлять дважды продукт в checkList если он имеет два или более выбранных цвета в args
            let index = +el + 1  // Добавляю единицу ко всем индексам ел-ов из products чтобы они не начинались с ед.
            let product = await ListingPage.getProduct(index) //Scroll to product
            await ListingPage.driver.executeScript("arguments[0].scrollIntoView()",product)
            let colors = await ListingPage.getProductColors(index) // Нахожу все опции цветов продукта в списке продуктов
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

    // Метод для проверки цветов в списке продуктов, если выбран один продукт
    async productsHaveColor (linkColor){
        let products = await ListingPage.getAllProducts()
        let checkList = []
        first: for(let el in products){
            let index = +el + 1
            let colors = await ListingPage.getProductColors(index)
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

    determineOrder (arr) {
        if(arr.length < 2){
           return 'not enough items';
        };
        let ascending = null;
        let nextArr = arr.slice(1);
        for(var i = 0; i < nextArr.length; i++) {
           if(nextArr[i] === arr[i]){
              continue;
           }else if(ascending === null) {
              ascending = nextArr[i] > arr[i];
           }else if (ascending !== nextArr[i] > arr[i]){
              return 'unsorted';
           };
        }
        if(ascending === null){
           return 'all items are equal';
        };
        return ascending ? 'ascending' : 'descending';
     };
}

module.exports = new myAssert();
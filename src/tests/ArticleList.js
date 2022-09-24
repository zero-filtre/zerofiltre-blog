const { faker } =require('@faker-js/faker');

let email = "demo.user@zerofiltre.tech"
let password = "demoUser85$"


module.exports = {
    'Sign in with mandatory fields (email and password) and correct values': (browser) => {

        browser
            .navigateTo('/login')
            .waitForElementVisible("#username", 3000)
            .assert.visible("#username")
            .sendKeys("#username", email)
            .sendKeys("#password", password)
            .click("button[type='submit']")

    },

    'Signin User': (browser) => {

        browser
            .waitForElementVisible(`img[alt='${fullname}']`, 3000)
            .assert.visible(`img[alt='${fullname}']`)
    },

    'Redirect to articles page': (browser) => {
        browser
            .waitForElementVisible('.article-card', 3000)
            .assert.visible('.article-card')
    },

    'List popular article': (browser) => {
        browser
            .waitForElementVisible('.tabs-wrapper', 3000)
            .assert.visible('.tabs-wrapper')
    }

}
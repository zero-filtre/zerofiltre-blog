const { faker } =require('@faker-js/faker');

let email = "demo.user@zerofiltre.tech"
let password = "demoUser85$"
fullname = "Demo user";

module.exports = {
    'Sign in with mandatory fields (email and password) and correct values': (browser) => {

        browser
            .navigateTo('/login')
            .waitForElementVisible("#username", 5000)
            .assert.visible("#username")
            .sendKeys("#username", email)
            .sendKeys("#password", password)
            .click("button[type='submit']")
            .waitForElementPresent("button[aria-labelledby='logout button']")

    },


    'Redirect to articles page': (browser) => {
        browser
            .waitForElementVisible('.article-card', 5000)
            .assert.visible('.article-card')
    },

    'List recent article': (browser) => {
        browser
            .waitForElementVisible('.tabs-wrapper', 5000)
            .assert.visible('.tabs-wrapper')
    },

    'List popular article': (browser) => {
        browser
            .navigateTo('/articles?filter=popular')
            .waitForElementVisible('.tabs-wrapper', 5000)
            .assert.visible('.tabs-wrapper')

    }

}
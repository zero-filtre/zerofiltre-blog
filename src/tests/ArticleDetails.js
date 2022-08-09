const { faker } =require('@faker-js/faker');

let email = "demo.user@zerofiltre.tech"
let password = "demoUser85$"

let destinitation_url = '';

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

    'Get the article details': (browser) => {
        browser
            .waitForElementVisible('.article-title', 3000)
            .assert.visible('.article-title')
            .click(".article-title")
            .waitForElementVisible('markdown', 3000)
            .assert.visible('markdown')
            
    },

    'Add reactions to the article': (browser) => {
        browser
            .waitForElementVisible('.reactions', 3000)
            .assert.visible('.reactions')
            .click(".reactions button")
            
    },
    'Open a similar article': (browser) => {
        browser
            .waitForElementVisible('.related-articles', 3000)
            .assert.visible('.similar-articles a')
            .getAttribute('.similar-articles a', 'href', function(result){
                destinitation_url = result.value;
            })
            .click(".similar-articles a")
            .assert.not.urlContains(destinitation_url)
            
    },

}
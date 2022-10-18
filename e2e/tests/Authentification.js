const { faker } =require('@faker-js/faker');

let email = faker.internet.email()+"test"
let password = "demoUser85$"

let fullname = faker.name.findName()

module.exports = {
    'Register a new account with mandatory fields (fullname, email, password, password confirmation)': (browser) => {

        browser
            .navigateTo('/register')
            .waitForElementVisible(".cc-nb-okagree")
            .click(".cc-nb-okagree")
            .waitForElementNotVisible(".cc-nb-okagree")
            .waitForElementVisible("#fullName", 5000)
            .assert.visible("#fullName")
            .sendKeys("#fullName", fullname)
            .sendKeys("#email", email)
            .sendKeys("#password", password)
            .sendKeys("#matchingPassword", password)
            .click("button[type='submit']")
    },

    'Confirmation message': (browser) => {

        browser
            .waitForElementVisible(".mat-simple-snack-bar-content", 5000)
            .assert.visible(".mat-simple-snack-bar-content")
            .assert.textContains('.mat-simple-snack-bar-content', 'Email de validation envoyé, veuillez consulter votre boite mail');

    },

    'Redirect to articles page': (browser) => {
        browser
            .waitForElementVisible('.article-card', 5000)
            .assert.visible('.article-card')
    },

    'Sign out 1': (browser) => {
        browser
            .click("button[aria-label='Toggle sidenav']")
            .click("button[aria-labelledby='logout button']")
            .waitForElementNotPresent("button[aria-labelledby='logout button']")
    },

    'Register a new account with an already registered email': (browser) => {
        browser
            .navigateTo('/register')
            .waitForElementVisible("#fullName", 5000)
            .assert.visible("#fullName")
            .sendKeys("#fullName", fullname)
            .sendKeys("#email", email)
            .sendKeys("#password", password)
            .sendKeys("#matchingPassword", password)
            .click("button[type='submit']")
    },

    'Eror notification message on used email': (browser) => {

        browser
            .waitForElementVisible(".mat-simple-snack-bar-content", 5000)
            .assert.visible(".mat-simple-snack-bar-content")
            .assert.textContains('.mat-simple-snack-bar-content', email);

    },

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

    'Sign out 2': (browser) => {
        browser
            .click("button[aria-label='Toggle sidenav']")
            .click("button[aria-labelledby='logout button']")
            .waitForElementNotPresent("button[aria-labelledby='logout button']")
    },

    'Sign in with mandatory fields (email and password) and wrong values': (browser) => {

        browser
            .navigateTo('/login')
            .waitForElementVisible("#username", 5000)
            .assert.visible("#username")
            .sendKeys("#username", email)
            .sendKeys("#password", faker.internet.password(8))
            .click("button[type='submit']")

    },


    'Eror notification message credentials incorrect': (browser) => {

        browser
            .waitForElementPresent(".mat-simple-snack-bar-content", 5000)
            .assert.textContains('.mat-simple-snack-bar-content', "Email ou mot de passe incorrect !");

    }

}
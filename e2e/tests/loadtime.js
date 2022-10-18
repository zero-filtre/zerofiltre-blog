module.exports = {
    'Load home page after 3 seconds max': (browser) => {
        browser
            .navigateTo('/')
            .waitForElementVisible(".logo-link", 5000)
            .assert.visible(".logo-link")
    }
}
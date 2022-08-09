module.exports = {
    'Load home page after 3 seconds max': (browser) => {
        browser
            .navigateTo('/')
            .waitForElementVisible("a[href='/articles']", 3000)
            .assert.visible("a[href='/articles']",)
            .assert.textContains("a[href='/articles']", 'Blog');
    }
}
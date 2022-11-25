let email = "demo.user@zerofiltre.tech";
let password = "demoUser85$";

const fullname = "Demo user";

let destinitation_url = "";

module.exports = {
  "Sign in with mandatory fields (email and password) and correct values": (
    browser
  ) => {
    browser

      .navigateTo("/login")
      .waitForElementVisible(".cc-nb-okagree")
      .click(".cc-nb-okagree")
      .waitForElementNotVisible(".cc-nb-okagree")
      .waitForElementVisible("#username", 5000)
      .assert.visible("#username")
      .sendKeys("#username", email)
      .sendKeys("#password", password)
      .click("button[type='submit']")
      .waitForElementPresent("button[aria-labelledby='logout button']");
  },

  // 'Redirect to articles page': (browser) => {
  //     browser
  //         .waitForElementVisible('.article-card', 10000)
  //         .assert.visible('.article-card')
  // },

  "Add article": (browser) => {
    browser
      .fullscreenWindow()
      .waitForElementVisible(
        'button[aria-label="Button to create a new article"]',
        5000
      )
      .click('button[aria-label="Button to create a new article"]')
      .waitForElementVisible("#title", 5000)
      .assert.visible("#title")
      .sendKeys("#title", "Titre Article de test")
      .click("button[aria-labelledby='create an article']")
      .waitForElementVisible("#summary", 5000)
      .sendKeys("#summary", "description super article de test")
      .waitForElementVisible(".selected-tags-container", 5000)
      .click(".selected-tags-container")
      .waitForElementVisible(".tagItem", 5000)
      .click(".tagItem")
      .sendKeys("#content", "Contenu mon super article de test")
      .waitForElementVisible(
        "button[aria-labelledby='button to publish or submit an article']"
      )
      .execute(function () {
        document
          .querySelector(
            "button[aria-labelledby='button to publish or submit an article']"
          )
          .click();
      }, []);
    // .click("button[aria-labelledby='button to publish or submit an article']")
  },

  "success publication": (browser) => {
    browser
      .waitForElementVisible(".mat-simple-snack-bar-content", 5000)
      .assert.visible(".mat-simple-snack-bar-content")
      .assert.textContains(".mat-simple-snack-bar-content", "success");
  },

  "edit article": (browser) => {
    browser
      .waitForElementVisible(
        "button[aria-label='icon-button with a menu']",
        5000
      )
      .assert.visible("button[aria-label='icon-button with a menu']")
      .click("button[aria-label='icon-button with a menu']")
      .waitForElementVisible('a[routerlink="edit"]')
      .click('a[routerlink="edit"]')
      .waitForElementVisible("#summary", 5000)
      .sendKeys("#summary", "description super article de test modifié")
      .click(
        "button[aria-labelledby='button to publish or submit an article']"
      );
  },

  "success modification": (browser) => {
    browser
      .waitForElementVisible(".mat-simple-snack-bar-content", 5000)
      .assert.visible(".mat-simple-snack-bar-content")
      .assert.textContains(".mat-simple-snack-bar-content", "success");
  },

  "delete article": (browser) => {
    browser
      .waitForElementVisible(
        "button[aria-label='icon-button with a menu']",
        5000
      )
      .assert.visible("button[aria-label='icon-button with a menu']")
      .click("button[aria-label='icon-button with a menu']")
      .waitForElementVisible('button[aria-labelledby="Delete article button"]')
      .click('button[aria-labelledby="Delete article button"]')
      .waitForElementVisible(
        'button[aria-labelledby="Delete article button"]',
        5000
      )
      .click('button[aria-labelledby="Delete article button"]');
  },
};

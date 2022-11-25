const { faker } = require("@faker-js/faker");

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

  "Redirect to articles page": (browser) => {
    browser
      .waitForElementVisible(".article-card", 5000)
      .assert.visible(".article-card");
  },

  "Get the article details": (browser) => {
    browser
      .waitForElementVisible(".article-title", 5000)
      .assert.visible(".article-title")
      .click(".article-title")
      .waitForElementVisible("markdown", 5000)
      .assert.visible("markdown");
  },

  "Add reactions to the article": (browser) => {
    browser
      .waitForElementVisible(".reactions", 5000)
      .assert.visible(".reactions")
      .click(".reactions button");
  },
  "Open a similar article": (browser) => {
    browser
      .waitForElementVisible(".related-articles", 5000)
      .assert.visible(".similar-articles a")
      .click(".similar-articles a");
  },
};

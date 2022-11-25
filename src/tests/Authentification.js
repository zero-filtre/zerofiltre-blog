const { faker } = require("@faker-js/faker");

let email = faker.internet.email();
let password = faker.internet.password(8, false) + "$";

let fullname = faker.name.findName();

module.exports = {
  "Register a new account with mandatory fields (fullname, email, password, password confirmation)":
    (browser) => {
      browser
        .navigateTo("/register")
        .waitForElementVisible("#fullName", 3000)
        .assert.visible("#fullName")
        .sendKeys("#fullName", fullname)
        .sendKeys("#email", email)
        .sendKeys("#password", password)
        .sendKeys("#matchingPassword", password)
        .click("button[type='submit']");
    },

  "Confirmation message": (browser) => {
    browser
      .waitForElementVisible(".mat-simple-snack-bar-content", 3000)
      .assert.visible(".mat-simple-snack-bar-content")
      .assert.textContains(
        ".mat-simple-snack-bar-content",
        "Email de validation envoyé, veuillez consulter votre boite mail"
      );
  },

  "Signin User": (browser) => {
    browser
      .waitForElementVisible(`img[alt='${fullname}']`, 3000)
      .assert.visible(`img[alt='${fullname}']`);
  },

  "Redirect to articles page": (browser) => {
    browser
      .waitForElementVisible(".article-card", 3000)
      .assert.visible(".article-card");
  },

  "Sign out": (browser) => {
    browser
      .click(".mat-toolbar button")
      .waitForElementVisible(".cdk-overlay-container button")
      .click(".cdk-overlay-container button")
      .waitForElementVisible("a[routerlink='/login'", 3000)
      .assert.visible("a[routerlink='/login'");
  },

  "Register a new account with an already registered email": (browser) => {
    browser
      .navigateTo("/register")
      .waitForElementVisible("#fullName", 3000)
      .assert.visible("#fullName")
      .sendKeys("#fullName", fullname)
      .sendKeys("#email", email)
      .sendKeys("#password", password)
      .sendKeys("#matchingPassword", password)
      .click("button[type='submit']");
  },

  "Eror notification message on used email": (browser) => {
    browser
      .waitForElementVisible(".mat-simple-snack-bar-content", 3000)
      .assert.visible(".mat-simple-snack-bar-content")
      .assert.textContains(".mat-simple-snack-bar-content", email);
  },

  "Sign in with mandatory fields (email and password) and correct values": (
    browser
  ) => {
    browser
      .navigateTo("/login")
      .waitForElementVisible("#username", 3000)
      .assert.visible("#username")
      .sendKeys("#username", email)
      .sendKeys("#password", password)
      .click("button[type='submit']");
  },

  "Sign in with mandatory fields (email and password) and wrong values": (
    browser
  ) => {
    browser
      .navigateTo("/login")
      .waitForElementVisible("#username", 3000)
      .assert.visible("#username")
      .sendKeys("#username", email)
      .sendKeys("#password", faker.internet.password(8))
      .click("button[type='submit']");
  },

  "Eror notification message credentials incorrect": (browser) => {
    browser
      .waitForElementVisible(".mat-simple-snack-bar-content", 3000)
      .assert.visible(".mat-simple-snack-bar-content")
      .assert.textContains(
        ".mat-simple-snack-bar-content",
        "Email ou mot de passe incorrect !"
      );
  },
};

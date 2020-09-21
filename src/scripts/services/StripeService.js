app.service('StripeService', function($location, $http, APIRegister, Restangular, $timeout) {
  var stripe = {};

  // get array of connected stripe accounts
  stripe.getAccount = function() {
    // get array of connected stripe accounts
    return Restangular.one('account/stripe/connect').customGET();
  }

  // get the stripe client ID
  stripe.clientID = function() {
    return Restangular.one('account/stripe/application').customGET();
  }

  // update the stripe client ID
  stripe.updateClientID = function(dataArray) {
    return Restangular.one('account/stripe/application').customPUT(dataArray);
  }

  //redirect back to a certain page
  stripe.redirectURL = function() {
    return window.location.protocol + "//" + window.location.host + document.getElementsByTagName("base")[0].getAttribute("href") + "stripe/connect";
  }

  stripe.connect = function() {
    //if code and scope are returned by redirect, connect the account.
    if ($location.search()['code'] && $location.search()['scope']) {
      return Restangular.one('account/stripe/connect').customPOST({ "code": $location.search()['code'], "scope": $location.search()['scope'] });
    } else if ($location.search()['code']) {
      // If no scope express is being used.
      return Restangular.one('account/stripe/connect').customPOST({ "code": $location.search()['code'] });
    }
  }

  stripe.removeStripeConnect = function(account) {
    return Restangular.one('account/stripe/connect', account.id).customDELETE();
  }

  stripe.generateStateParam = function(directPath) {
    var incode64 = btoa(directPath);
    return incode64;
  }

  stripe.getCurrencies = function() {
    return Restangular.one('account/stripe/currency').customGET();
  }

  /*
   *************pledger functions*************
   */

  //retrieve pledger stripe account
  stripe.getPledgerAccount = function() {
    return Restangular.one('account/stripe').customGET();
  }

  //create new pledger stripe account with card information
  stripe.newPledgerAccount = function(dataArray) {
    return Restangular.one('account/stripe').customPOST(dataArray);
  }

  //create new guest pledger stripe account with card information
  stripe.newGuestPledgerAccount = function(dataArray) {
    return Restangular.one('account/stripe/guest').customPOST(dataArray);
  }

  //delete pledger stripe account with card informations
  stripe.deletePledgerAccount = function(dataArray) {
    return Restangular.one('account/stripe').customDELETE(dataArray);
  }

  // add new card to existing account
  stripe.createCard = function(accountID, dataArray) {
    return Restangular.one('account/stripe', accountID).one('card').customPOST(dataArray);
  }

  // update a card
  stripe.updateCard = function(accountID, cardID, dataArray) {
    return Restangular.one('account/stripe', accountID).one('card', cardID).customPUT(dataArray);
  }

  // delete a card
  stripe.deleteCard = function(accountID, cardID) {
    return Restangular.one('account/stripe', accountID).one('card', cardID).customDELETE();
  }

  // get all the cards associated to the account
  stripe.getCards = function(accountID) {
    return Restangular.one('account/stripe', accountID).one('card').customGET();
  }

  // copy function
  function copyObjectProperties(srcObj, destObj) {
    for (var key in srcObj) {
      destObj[key] = srcObj[key];
    }
  }

  return stripe;
});
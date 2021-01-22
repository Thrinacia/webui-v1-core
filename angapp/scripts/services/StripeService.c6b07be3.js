app.service("StripeService",["$location","$http","APIRegister","Restangular","$timeout",function($location,$http,APIRegister,Restangular,$timeout){var stripe={};return stripe.getAccount=function(){return Restangular.one("account/stripe/connect").customGET()},stripe.clientID=function(){return Restangular.one("account/stripe/application").customGET()},stripe.updateClientID=function(dataArray){return Restangular.one("account/stripe/application").customPUT(dataArray)},stripe.redirectURL=function(){return window.location.protocol+"//"+window.location.host+document.getElementsByTagName("base")[0].getAttribute("href")+"stripe/connect"},stripe.connect=function(){return $location.search().code&&$location.search().scope?Restangular.one("account/stripe/connect").customPOST({code:$location.search().code,scope:$location.search().scope}):$location.search().code?Restangular.one("account/stripe/connect").customPOST({code:$location.search().code}):void 0},stripe.removeStripeConnect=function(account){return Restangular.one("account/stripe/connect",account.id).customDELETE()},stripe.generateStateParam=function(directPath){var incode64=btoa(directPath);return incode64},stripe.getCurrencies=function(){return Restangular.one("account/stripe/currency").customGET()},stripe.getPledgerAccount=function(retry_pledge_token){var params={};return retry_pledge_token&&(params.retry_pledge_token=retry_pledge_token),Restangular.one("account/stripe").customGET("",params)},stripe.newPledgerAccount=function(dataArray){return Restangular.one("account/stripe").customPOST(dataArray)},stripe.newGuestPledgerAccount=function(dataArray){return Restangular.one("account/stripe/guest").customPOST(dataArray)},stripe.deletePledgerAccount=function(dataArray){return Restangular.one("account/stripe").customDELETE(dataArray)},stripe.createCard=function(accountID,dataArray){return Restangular.one("account/stripe",accountID).one("card").customPOST(dataArray)},stripe.updateCard=function(accountID,cardID,dataArray){return Restangular.one("account/stripe",accountID).one("card",cardID).customPUT(dataArray)},stripe.deleteCard=function(accountID,cardID){return Restangular.one("account/stripe",accountID).one("card",cardID).customDELETE()},stripe.getCards=function(accountID){return Restangular.one("account/stripe",accountID).one("card").customGET()},stripe.setBrandIcon=function(brand,cardBrandToPfClass){var brandIconElement=document.getElementById("brand-icon"),pfClass="pf-credit-card";if(brand in cardBrandToPfClass)switch(pfClass=cardBrandToPfClass[brand],brand){case"visa":$("#brand-icon").css("background-image","url(images/cards/Visa.png)");break;case"mastercard":$("#brand-icon").css("background-image","url(images/cards/MasterCard.png)");break;case"amex":$("#brand-icon").css("background-image","url(images/cards/American%20Express.png)");break;case"dinersclub":$("#brand-icon").css("background-image","url(images/cards/diners.png)");break;case"discover":$("#brand-icon").css("background-image","url(images/cards/Discover.png)");break;case"jcb":$("#brand-icon").css("background-image","url(images/cards/jcb.png)");break;default:$("#brand-icon").css("background-image","url(images/cards/default-credit-card-icon.png)")}for(var i=brandIconElement.classList.length-1;i>=0;i--)brandIconElement.classList.remove(brandIconElement.classList[i]);brandIconElement.classList.add("pf"),brandIconElement.classList.add(pfClass)},stripe}]);
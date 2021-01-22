app.controller("RetryCardCtrl",["$scope","$rootScope","$routeParams","$location","Restangular","UserService","$translatePartialLoader","$translate","StripeService","PledgeService","$timeout","PortalSettingsService",function($scope,$rootScope,$routeParams,$location,Restangular,UserService,$translatePartialLoader,$translate,StripeService,PledgeService,$timeout,PortalSettingsService){$scope.card={};var userId=UserService.id,campaign_id=$routeParams.campaign_id,pledge_transaction_id=($routeParams.pledge_level_id,$routeParams.pledge_transaction_id);$scope.method="",$scope.payment_intent_client_secret=$routeParams.payment_intent_client_secret,$scope.payment_intent_status=$routeParams.payment_intent_status,$scope.payment_intent_client_secret_tip=$routeParams.payment_intent_client_secret_tip,$scope.payment_intent_status_tip=$routeParams.payment_intent_status_tip;var payment_method_id=$routeParams.payment_method,payment_method_tip_id=$routeParams.payment_method_tip,code=$routeParams.code,code_tip=$routeParams.code_tip,retry_pledge_token=($routeParams.use_sca,$routeParams.retry_pledge_token),payment_method={},payment_method_tip={};$scope.requiresAuthentication=!1,$scope.selectMethod=function(method){$scope.method=method},("requires_payment_method"==$scope.payment_intent_status&&"authentication_required"==code||"requires_payment_method"==$scope.payment_intent_status_tip&&"authentication_required"==code_tip)&&($scope.requiresAuthentication=!0);var pledgeSuccessMessage=function(){$scope.retrySuccess=!0,$(".repledge-thank-you").modal("show"),delete $scope.failedMessage},pledgeFailMessage=function(){$scope.requiresAuthentication=!1,$("#authentication-failed").modal("show"),$scope.$apply()};PortalSettingsService.getSettingsObj().then(function(settings){$scope.site_stripe_tokenization_settings=settings.public_setting.site_stripe_tokenization,Restangular.one("campaign",$routeParams.campaign_id).customGET().then(function(campaign){function repledge(data){data.use_sca=1,PledgeService.retryPledge(data,campaign_id,pledge_transaction_id,stripe_pledge,stripe_tip).then(function(){$scope.retrySuccess=!0,$(".repledge-thank-you").modal("show")})["catch"](function(failed){pledgeFailMessage(),$("#retrypledge").removeClass("disabled")})}var stripe=Stripe($scope.site_stripe_tokenization_settings.public_stripe_key),stripe_pledge=Stripe($scope.site_stripe_tokenization_settings.public_stripe_key),stripe_tip=stripe_pledge;!settings.public_setting.site_campaign_fee_direct_transaction&&settings.public_setting.stripe_standard_mode&&campaign.managers[0]&&campaign.managers[0].publishable_key&&(stripe_pledge=Stripe(campaign.managers[0].publishable_key)),$scope.initStripeElement=function(){var translation=$translate.instant(["pledge_campaign_stripe_elements_cardExpirey","pledge_campaign_stripe_elements_cardNumber","pledge_campaign_creditcard_cvc_placeholder"]);$scope.elements=stripe.elements();var cardBrandToPfClass={visa:"pf-visa",mastercard:"pf-mastercard",amex:"pf-american-express",discover:"pf-discover",diners:"pf-diners",jcb:"pf-jcb",unknown:"pf-credit-card"},style={base:{iconColor:"#A3A3A3",color:"#000000",lineHeight:"16px",fontWeight:400,fontFamily:'Lato,"Helvetica Neue0",Arial,Helvetica,sans-serif',fontSize:"14px","::placeholder":{color:"#A3A3A3"}},invalid:{color:"#d95c5c",":focus":{color:"#d95c5c"}}};$scope.cardNumberElement=$scope.elements.create("cardNumber",{placeholder:translation.pledge_campaign_stripe_elements_cardNumber,iconStyle:"solid",style:style}),$scope.cardNumberElement.mount("#card-number-element"),$scope.cardExpiryElement=$scope.elements.create("cardExpiry",{placeholder:translation.pledge_campaign_stripe_elements_cardExpirey,iconStyle:"solid",style:style}),$scope.cardExpiryElement.mount("#card-expiry-element"),$scope.cardCvcElement=$scope.elements.create("cardCvc",{placeholder:translation.pledge_campaign_creditcard_cvc_placeholder,iconStyle:"solid",style:style}),$scope.cardCvcElement.mount("#card-cvc-element"),$scope.cardNumberElement.addEventListener("change",function(event){var displayError=angular.element("#card-errors");event.error?displayError.textContent=event.error.message:displayError.textContent="",event.brand&&StripeService.setBrandIcon(event.brand,cardBrandToPfClass)}),$("#brand-icon").css("background-image","url(images/cards/default-credit-card-icon.png)")},$scope.authenticateCard=function(){payment_method=payment_method_id&&payment_method_id.length>3&&"tok_"==payment_method_id.substring(0,4)?{payment_method:{card:{token:payment_method_id}}}:{payment_method:payment_method_id},payment_method_tip=payment_method_tip_id&&payment_method_tip_id.length>3&&"tok_"==payment_method_tip_id.substring(0,4)?{payment_method:{card:{token:payment_method_tip_id}}}:{payment_method:payment_method_tip_id},("requires_payment_method"==$scope.payment_intent_status&&"authentication_required"==code||"requires_payment_method"==$scope.payment_intent_status_tip&&"authentication_required"==code_tip)&&("requires_payment_method"==$scope.payment_intent_status&&"authentication_required"==code&&"requires_payment_method"==$scope.payment_intent_status_tip&&"authentication_required"==code_tip?stripe_pledge.confirmCardPayment($scope.payment_intent_client_secret,payment_method).then(function(pi){pi.error?pledgeFailMessage():stripe_tip.confirmCardPayment($scope.payment_intent_client_secret_tip,payment_method_tip).then(function(pi){pi.error?pledgeFailMessage():Restangular.one("campaign",campaign_id).one("pledge-transaction",pledge_transaction_id).customPUT({sca_confirm_intent_capture:1,retry_pledge_token:retry_pledge_token,use_sca:1}).then(function(success){pledgeSuccessMessage()})})}):"requires_payment_method"==$scope.payment_intent_status&&"authentication_required"==code?stripe_pledge.confirmCardPayment($scope.payment_intent_client_secret,payment_method).then(function(pi){pi.error?pledgeFailMessage():Restangular.one("campaign",campaign_id).one("pledge-transaction",pledge_transaction_id).customPUT({sca_confirm_intent_capture:1,retry_pledge_token:retry_pledge_token,use_sca:1}).then(function(success){pledgeSuccessMessage()})}):"requires_payment_method"==$scope.payment_intent_status_tip&&"authentication_required"==code_tip&&stripe_tip.confirmCardPayment($scope.payment_intent_client_secret_tip,payment_method_tip).then(function(pi){pi.error?pledgeFailMessage():Restangular.one("campaign",campaign_id).one("pledge-transaction",pledge_transaction_id).customPUT({sca_confirm_intent_capture:1,retry_pledge_token:retry_pledge_token,use_sca:1}).then(function(success){pledgeSuccessMessage()})}))},$scope.existedCards=[],$scope.cardSelected={},$scope.old_card_id="",$scope.new_card_id="";var existedStripeAccountCardId;$scope.$emit("loading_finished"),setTimeout(function(){$("#propagate").checkbox("check")},200),campaign_id&&Restangular.one("campaign",campaign_id).customGET().then(function(success){$scope.campaign=success}),pledge_transaction_id&&Restangular.one("campaign",campaign_id).one("pledge-transaction",pledge_transaction_id).customGET("",{retry_pledge_token:retry_pledge_token}).then(function(success){$scope.failedContrib=success,$scope.failedContrib.amount_total=parseFloat(success.amount)+parseFloat(success.amount_tip||0),$scope.old_card_id=$scope.failedContrib.stripe_account_card_id},function(failed){"account_campaign_permission_transaction_entry_backer"==failed.data.code?$(".ui.modal#wrong-account").modal({closable:!1}).modal("show"):"entity_not_found"==failed.data.code&&$(".ui.modal#not-found-transaction").modal({closable:!1}).modal("show")}),$scope.saveCard=function(){var not_validated=!$("#credit-card-info").form("validate form");not_validated||($("#retrypledge").addClass("disabled"),"new"==$scope.method?StripeService.getPledgerAccount(retry_pledge_token).then(function(account){var account_id=account[0].id;stripe.createToken($scope.cardNumberElement).then(function(result){var data={card_token:result.token.id,retry_pledge_token:retry_pledge_token};StripeService.newPledgerAccount(data).then(function(result){var data={stripe_transaction_entry_backer_id:account_id,stripe_account_card_id:result.cards[0].stripe_account_card_id,retry_pledge_token:retry_pledge_token};repledge(data)})})}):(data={stripe_transaction_entry_backer_id:userId,stripe_account_card_id:existedStripeAccountCardId,retry_pledge_token:retry_pledge_token},repledge(data)))},$scope.submit=function(){switch($scope.method){case"authenticate":$scope.authenticateCard();break;case"new":case"existing":default:$scope.saveCard()}},$scope["goto"]=function(){$location.path("/explore")};var m_names=new Array("January","February","March","April","May","June","July","August","September","October","November","December"),currdate=new Date;$scope.currdate=m_names[currdate.getMonth()]+" "+currdate.getDate()+" "+currdate.getFullYear()+" "+currdate.getHours()+":"+currdate.getMinutes(),StripeService.getPledgerAccount(retry_pledge_token).then(function(success){$scope.existedCards=success[0].cards}),$scope.setStripeCardId=function(stripe_account_card_id){existedStripeAccountCardId=stripe_account_card_id},$scope.initStripePayment=function(){$timeout(function(){$("input[name='card-number']").payment("formatCardNumber"),$("input[name='cvc']").payment("formatCardCVC")},100)}})})}]);
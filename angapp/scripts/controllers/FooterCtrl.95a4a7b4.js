app.controller("FooterCtrl",["$browser","$http","$scope","$rootScope","Restangular","$timeout","$sce","RequestCacheService","PortalSettingsService","$translate","$translatePartialLoader",function($browser,$http,$scope,$rootScope,Restangular,$timeout,$sce,RequestCacheService,PortalSettingsService,$translate,$translatePartialLoader){$scope.leftMenu=[],$scope.middleMenu=[],$scope.rightMenu=[],$scope.social_links={},$scope.categories=[],$scope.left_category=[],$scope.middle_category=[],$scope.right_category=[],$scope.pages=[],$scope.footer_text={},$scope.show_footer=!0;var today=new Date;$scope.current_year=today.getFullYear(),RequestCacheService.getPage().then(function(success){$scope.pages=success;for(var length=$scope.pages.length,i=0;i<length;i++)if(1==$scope.pages[i].id||"/"==$scope.pages[i].path){$scope.pages[i].path="";break}}),$translate(["footer_page_twitter_share_message_pledge","footer_page_twitter_share_message_campaign"]).then(function(values){a2a_config.localize={share_message_pledge_page:values.footer_page_twitter_share_message_pledge,share_message_campaign_page:values.footer_page_twitter_share_message_campaign}}),PortalSettingsService.getSettingsObj().then(function(success){var count=0;$rootScope.checkfooter=success,$scope.leftMenu=success.public_setting.site_menu_footer.left,$scope.rightMenu=success.public_setting.site_menu_footer.right,$scope.footer_text=success.public_setting.site_footer_text,$scope.social_links=success.public_setting.site_social_media_links,$scope.hasCategory=success.public_setting.site_theme_category_display_footer,$scope.footerCustomHtmlBlock=success.public_setting.site_footer_custom_html_block,angular.forEach($scope.social_links,function(value,key){value.url.length>0&&count++}),0===count&&($scope.show_footer=!1),$scope.wp_uri=success.public_setting.site_widget_wp_api,$scope.twitter_widget=success.public_setting.site_widget_twitter_widget}),Restangular.one("portal/setting").getList().then(function(success){if($scope.public_settings={},angular.forEach(success,function(value){3==value.setting_type_id&&($scope.public_settings[value.name]=value.value)}),$scope.enableCookeConsent=$scope.public_settings.site_enable_cookie_consent,$scope.public_settings.site_theme_category_display_footer){var categoryParam={active_only:0};categoryParam.active_only=$scope.public_settings.site_theme_category_display_with_campaigns_only?0:1,Restangular.one("portal").customGET("category",categoryParam).then(function(categories){$scope.categories=categories;for(var i=0;i<$scope.categories.length;i++)i<4?$scope.left_category.push($scope.categories[i]):i<9?$scope.middle_category.push($scope.categories[i]):i<14&&$scope.right_category.push($scope.categories[i])})}}),$scope.findPageAndLink=function(link){if(void 0!=link.id){for(var i=0;i<$scope.pages.length;i++)if($scope.pages[i].id==link.id)return 1==$scope.pages[i].id&&($scope.pages[i].path=$browser.baseHref()),$scope.pages[i]}else if(void 0!=link.name)return link;return{}}}]);
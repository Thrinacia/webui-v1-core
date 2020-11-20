app.controller("AdminSiteMenusCtrl",["$location","$q","$scope","$rootScope","$timeout","$translatePartialLoader","$translate","Restangular","RequestCacheService",function($location,$q,$scope,$rootScope,$timeout,$translatePartialLoader,$translate,Restangular,RequestCacheService){function initTableItems(){$scope.menu_selected="Navigation",$scope.menu_links=$scope.public_settings.site_menu_header}function getPublicSettings(){Restangular.one("portal/setting").getList().then(function(success){$scope.public_settings={},$scope.private_settings={},angular.forEach(success,function(value){3==value.setting_type_id?$scope.public_settings[value.name]=value.value:1==value.setting_type_id&&($scope.private_settings[value.name]=value.value)}),initTableItems()},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})}function formValidation(){var translation=$translate.instant(["tab_sitemenu_missing_name_error","tab_sitemenu_mising_path_error","tab_sitemenu_select_page_error"]);$scope.publishedFields?$(".ui.form#add-menu-item").form({published_select:{identifier:"published-select",rules:[{type:"empty",prompt:translation.tab_sitemenu_select_page_error}]}},{inline:!0,keyboardShortcuts:!1,onSuccess:function(){$scope.formValCheck=!0},onFailure:function(){$scope.formValCheck=!1}}):$(".ui.form#add-menu-item").form({link_name:{identifier:"link_name",rules:[{type:"empty",prompt:translation.tab_sitemenu_missing_name_error}]},link_path:{identifier:"link_path",rules:[{type:"empty",prompt:translation.tab_sitemenu_missing_path_error}]}},{inline:!0,keyboardShortcuts:!1,onSuccess:function(){$scope.formValCheck=!0},onFailure:function(){$scope.formValCheck=!1}}),$(".ui.form#add-menu-item").form("validate form")}function saveMenu(){var payload=$scope.public_settings;"Navigation"==$scope.menu_selected?payload.site_menu_header=$scope.menu_links:"Footer 1"==$scope.menu_selected?payload.site_menu_footer.left=$scope.menu_links:"Footer 2"==$scope.menu_selected&&(payload.site_menu_footer.right=$scope.menu_links),console.log(payload);var request=Restangular.one("portal/setting/public").customPUT(payload);request.then(function(){msg={header:"success_message_save_changes_button"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()},function(failed){msg={header:failed.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})}var msg=[];$scope.menuSections=["Navigation","Footer 1","Footer 2"],$scope.menu_links=[],$scope.publishedFields=!0,$scope.parentPage=null,$scope.publishedPage=null,$scope.externalLink={name:"",path:""},$scope.menuSortOptions={stop:function(e,ui){saveMenu()}},$scope.changeFieldsDisplay=function(){$scope.publishedFields=!$scope.publishedFields},getPublicSettings(),$scope.menuManage=function(menu){$scope.menuShow=!0,$scope.menu_selected=menu;var footer=$scope.public_settings.site_menu_footer;"Navigation"==menu?$scope.menu_links=$scope.public_settings.site_menu_header:"Footer 1"==menu?$scope.menu_links=footer.hasOwnProperty("left")?footer.left:[]:"Footer 2"==menu&&($scope.menu_links=footer.hasOwnProperty("right")?footer.right:[])},$scope.findPageByID=function(id){for(var i=0;i<$scope.pages.length;i++)if($scope.pages[i].id==id)return $scope.pages[i];return{}},$scope.setExternalLink=function(){""!=$scope.externalLink.name&&""!=$scope.externalLink.path&&($scope.menu_links.push($scope.externalLink),$scope.externalLink={name:"",path:""})},$scope.setParentPage=function(page){$scope.parentPage=page},$scope.setPublishedPage=function(page){$scope.publishedPage=page},$scope.addToParent=function(page){for(var i=0;i<$scope.menu_links.length;i++)if($scope.parentPage.id==$scope.menu_links[i].id){var formattedPage={id:page.id,name:page.name,path:page.path};$scope.menu_links[i].hasOwnProperty("subpages")?$scope.menu_links[i].subpages.push(formattedPage):$scope.menu_links[i].subpages=[formattedPage];break}},$scope.clickPages=function(){$timeout(function(){angular.element('[data-tab="pages"]').triggerHandler("click")})},$scope.addPage=function($event){if($target=$($event.currentTarget),$event.preventDefault(),$scope.publishedFields)if(null!==$scope.parentPage)$scope.addToParent($scope.publishedPage),$scope.parentPage=null;else{var count=0;if(null!==$scope.publishedPage){for(var i=0;i<$scope.menu_links.length;i++)if($scope.publishedPage.id==$scope.menu_links[i].id){count++;break}if(0==count){var insert=!0;"Navigation"==$scope.menu_selected&&$scope.menu_links.length>=7&&($translate(["too_many_links"]).then(function(value){$scope.$parent.formData.error=value.too_many_links}),$(".response-error-modal").modal("show"),insert=!1),insert&&$scope.menu_links.push($scope.publishedPage)}}}else""!=$scope.externalLink.name&&""!=$scope.externalLink.path&&(null!==$scope.parentPage?($scope.addToParent($scope.externalLink),$scope.parentPage=null):$scope.menu_links.push($scope.externalLink),$scope.externalLink={name:"",path:""});formValidation(),$scope.formValCheck&&(saveMenu(),$target.closest(".modal").modal({onHidden:function(){$(".ui.form#add-menu-item").form("clear")}}).modal("hide"))},$scope.deleteLink=function(link){for(var i=0;i<$scope.menu_links.length;i++)void 0!=link.id&&$scope.menu_links[i].id==link.id?$scope.menu_links.splice(i,1):void 0!=link.name&&$scope.menu_links[i].name==link.name&&$scope.menu_links.splice(i,1)},$scope.deleteSubLink=function(parent,link){for(var i=0;i<parent.subpages.length;i++)void 0!=link.id&&parent.subpages[i].id==link.id?parent.subpages.splice(i,1):void 0!=link.name&&parent.subpages[i].name==link.name&&parent.subpages.splice(i,1)},$scope.deleteSubSave=function(parent,link){$scope.deleteSubLink(parent,link),saveMenu()},$scope.deleteLinkSave=function(link){$scope.deleteLink(link),saveMenu()},$scope.deleteMultiMenuItems=function(){var msg=[];$scope.menuItemsToDelete=[],$scope.subMenuItemsToDelete=[],$(".category-sortable-item").each(function(){if($(this).find(".t-menu-check-box input").prop("checked"))if($(this).scope().hasOwnProperty("link"))$scope.menuItemsToDelete.push($(this).scope().link);else{var subMenuItem={parent:$(this).offsetParent().scope().link,subpage:$(this).scope().subpage};$scope.subMenuItemsToDelete.push(subMenuItem)}}),$scope.menuItemsToDelete.length||$scope.subMenuItemsToDelete.length?$(".delete-multi-items-modal").modal("setting",{onApprove:$scope.confirmMultiDelete}).modal("show"):(msg={header:"tab_categories_select_error"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.confirmMultiDelete=function(){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg;for(var i=0;i<$scope.subMenuItemsToDelete.length;i++)$scope.deleteSubLink($scope.subMenuItemsToDelete[i].parent,$scope.subMenuItemsToDelete[i].subpage);for(var i=0;i<$scope.menuItemsToDelete.length;i++)$scope.deleteLink($scope.menuItemsToDelete[i]);saveMenu()},$scope.editLink=function(link){link.edit?(link.edit=!1,saveMenu()):link.edit=!0},$scope.showAddPageModal=function(){$(".add-page-modal").modal("show")},$scope.clearMessage=function(){$rootScope.floatingMessage=[]}}]);
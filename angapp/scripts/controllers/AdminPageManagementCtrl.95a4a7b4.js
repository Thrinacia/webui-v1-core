app.controller("AdminPagesCtrl",["$scope","$rootScope","$timeout","$location","$upload","Restangular","$translatePartialLoader","$translate","API_URL",function($scope,$rootScope,$timeout,$location,$upload,Restangular,$translatePartialLoader,$translate,API_URL){function initiateOptions(foption){for(var prop in $rootScope.froalaOptions)$rootScope.froalaOptions.hasOwnProperty(prop)&&(foption[prop]=$rootScope.froalaOptions[prop])}function insertIntoCodeView(text){var $codemirror=$(".CodeMirror")[0].CodeMirror;$codemirror.replaceSelection(text)}function getTwitterWidget(){var text=$scope.public_settings.site_widget_twitter_widget_code;if($scope.widget_options.tweet_limit){var tmp='data-tweet-limit="'+$scope.widget_options.tweet_limit+'" ',idx=text.indexOf("href");idx>0&&(text=text.splice(idx,0,tmp))}return text}function isDocumentWrite(htmlBlock){return!(!htmlBlock||!htmlBlock.match(/document.write/g))&&(msg={header:"document_write_prompt_msg"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),!0)}var contactFormHTML='<div class="ui form basic segment contact-form">   <div class="ui page dimmer contact-success-dimmer">   <div class="content">   <div class="center"> Your message has been sent successfully.</div>   </div>   </div>   <div class="field">   <label for=""> Full Name </label>  <div class="ui icon input field-name">  <input type="text" name="name" ng-model="formData.name">  <div class="ui corner label">  <i class="icon asterisk"></i>  </div>  </div>  </div>  <div class="field">  <label for=""> Email </label>  <div class="ui icon input field-email">  <input type="email" name="email" ng-model="formData.email">  <div class="ui corner label">  <i class="icon asterisk"></i>  </div>  </div>  </div>  <div class="field field-business">  <label for=""> Business/Organization </label>  <input type="text" placeholder="Optional" ng-model="formData.business_organization ">  </div>  <div class="field field-phone">  <label for=""> Phone Number </label>  <input type="text" placeholder="Optional" ng-model="formData.phone">  </div>  <div class="field field-message">  <label for=""> Message </label>  <div class="ui icon input">  <textarea name="description" id="" cols="30" rows="10" ng-model="formData.description"></textarea>  <div class="ui corner label">  <i class="icon asterisk"></i>  </div>  </div>  </div>    <div class="ui teal submit button"> Send </div>  </div>';$scope.clearMessage=function(){$rootScope.floatingMessage=[]};var msg=[];$scope.froalaOptionsPages={},$scope.metaTypes=["name","charset","http-equiv","property"],initiateOptions($scope.froalaOptionsPages),$scope.froalaOptionsPages.events["froalaEditor.commands.after"]=function(e,editor,cmd){"html"==cmd&&($rootScope.inHTMLMode+=1)},$scope.goBack=function(){$scope.pageShown=!1,$scope.listMeta=[],$rootScope.inHTMLMode%2==1&&($scope.froalaOptionsPages.froalaEditor("codeView.toggle"),$rootScope.inHTMLMode=0),$scope.isReservedPage=!1},$scope.editReservedPage=function(page){$scope.page=page,$scope.old_path=page.path,$scope.pageShown=!0,$scope.pageSectionTitle="tab_pages_editpage",$scope.pageEditType="edit",$scope.page.disable=!0,$scope.isReservedPage=!0},$scope.editPage=function($event,page){$rootScope.inHTMLMode=0,$scope.page=page,$scope.old_path=page.path,$scope.pageShown=!0,$scope.pageSectionTitle="tab_pages_editpage",$scope.pageEditType="edit",$scope.page.disable=!1,void 0==$scope.widget_index&&$("button.widgets").addClass("disabled"),$(".page-content").prev().find(".fr-view").focus(),$scope.isReservedPage=!1},$scope.widget_options={},$scope.showWPOptions=function(){$(".post-list-options").modal("show")},$scope.showTwitterOptions=function(){$(".twitter-widget-options").modal("show")},String.prototype.splice=function(idx,rem,s){return this.slice(0,idx)+s+this.slice(idx+Math.abs(rem))},$scope.setWidgetIndex=function(index){$scope.widget_index=index,void 0!=$scope.widget_index&&$("button.widgets").removeClass("disabled")},$scope.froalaOptionsPages.events["froalaEditor.initialized"]=function(e,editor){editor.events.bindClick($("body"),"button.widgets",function(){if($rootScope.inHTMLMode%2==0){if(editor.undo.saveStep(),1==$scope.widget_index)editor.html.insert(contactFormHTML);else if(2==$scope.widget_index){var text="<wp-post-list>__WordPress__</wp-post-list>";editor.html.insert(text)}else 3==$scope.widget_index&&editor.html.insert(getTwitterWidget());editor.undo.saveStep()}else if($rootScope.inHTMLMode%2==1)if(1==$scope.widget_index)insertIntoCodeView(contactFormHTML);else if(2==$scope.widget_index){var text="<wp-post-list>__WordPress__</wp-post-list>";insertIntoCodeView(text)}else 3==$scope.widget_index&&insertIntoCodeView(getTwitterWidget())})},$scope.confirmPageEdit=function($event){$scope.froalaOptionsPages.froalaEditor("events.trigger","form.submit",[],!0),$event.preventDefault(),$formData={},angular.copy($scope.page,$formData),$formData.content=$scope.froalaOptionsPages.froalaEditor("html.get"),$formData.path==$scope.old_path&&delete $formData.path,$formData.content&&($formData.content=$formData.content.replace(/&#10;/g,""),$formData.content=$formData.content.replace(/&#9;/g,""),$formData.content=$formData.content.replace(/&#8;/g,""),$formData.content=$scope.replaceInsideStyleTag($formData.content)),$formData.name&&$formData.id?(msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$scope.isCodeValid=!isDocumentWrite($formData.content),$scope.isCodeValid&&Restangular.one("portal").one("page").all($formData.id.toString()).customPUT($formData).then(function(success){$.each($scope.pages,function(key,value){value&&value.id==success[0].id&&($scope.pages[key]=success[0],$scope.pages[key].content=$scope.replaceStyleTag($scope.pages[key].content))}),$translate(["Page","modified"]).then(function(value){$scope.p=value.Page,$scope.modified=value.modified,msg={header:$scope.p+" "+success[0].name+" "+$scope.modified},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})):(msg={header:"tab_pages_editpage_pagename_validation"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.testinit=function(){$translate(["tab_pages_editpage_pagename_validation"]).then(function(translation){$("#page-view-form.ui.form").form({page_name:{identifier:"page_name",rules:[{type:"empty",prompt:translation.tab_pages_editpage_pagename_validation}]}},{inline:!0,onSuccess:function(){$scope.formValCheck=!0},onFailure:function(){$scope.formValCheck=!1}}).form("validate form")})},$scope.addPage=function($event){$scope.page={},$scope.pageShown=!0,$scope.pageSectionTitle="tab_pages_addpage",$scope.pageEditType="add",$scope.isReservedPage=!1,$scope.page.content='<div class="ui basic segment"> <div class="ui page grid"> <div class="column"> <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus neque sed ultrices imperdiet. Fusce egestas, dolor quis maximus condimentum, quam tellus porta nibh, a faucibus quam ligula facilisis neque. Maecenas pellentesque ex leo, vel laoreet dui pulvinar in. Donec nunc nisl, lacinia in pellentesque et, cursus a risus. Nullam at elit odio. Etiam venenatis id nisl non consectetur.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam luctus neque sed ultrices imperdiet. Fusce egestas, dolor quis maximus condimentum, quam tellus porta nibh, a faucibus quam ligula facilisis neque. Maecenas pellentesque ex leo, vel laoreet dui pulvinar in. Donec nunc nisl, lacinia in pellentesque et, cursus a risus. Nullam at elit odio. Etiam venenatis id nisl non consectetur.</p> </div> </div> </div>'},$scope.confirmPageAdd=function($event){$scope.formData={},$event.preventDefault(),angular.copy($scope.page,$scope.formData),$scope.formData.hasOwnProperty("content")&&($scope.formData.content.replace(/&#10;/g,""),$scope.formData.content.replace(/&#9;/g," "),$scope.formData.content.replace(/&#8;/g," ")),$scope.formData.name?(msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),$scope.isCodeValid=!isDocumentWrite($scope.formData.content),$scope.isCodeValid&&Restangular.one("portal").one("page").customPOST($scope.formData).then(function(success){$scope.pages.push(success[0]),$scope.pageShown=!1,msg={header:"success_message_save_changes_button"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})):(msg={header:"tab_pages_editpage_pagename_validation"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.deleteOnePage=function($event,page){$scope.page=page,$(".delete-one-page-modal").modal("show")},$scope.publishPage=function(){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$scope.pagesToPublish=[];var $table=$(".admin-table");$table.find("tbody > tr").each(function(){if($(this).find(".t-check-box input").prop("checked")){$scope.pagesToPublish.push($(this).scope().page);var page=$(this).scope().page;page.published=!0;var path=page.path;delete page.path,Restangular.one("portal/page",page.id.toString()).customPUT(page).then(function(success){$rootScope.floatingMessage=[],msg={header:"tab_pages_published_success"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),page.published=!0},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),page.published=!1}),$timeout(function(){page.path=path})}}),0==$scope.pagesToPublish.length&&(msg={header:"tab_pages_select_error"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.unpublishPage=function(){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$scope.pagesToPublish=[];var $table=$(".admin-table");$table.find("tbody > tr").each(function(){if($(this).find(".t-check-box input").prop("checked")){$scope.pagesToPublish.push($(this).scope().page);var page=$(this).scope().page;page.published="f";var path=page.path;delete page.path,Restangular.one("portal/page",page.id.toString()).customPUT(page).then(function(success){$rootScope.floatingMessage=[],msg={header:"tab_pages_unpublished_success"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),page.published=!1},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),page.published=!0}),$timeout(function(){page.path=path})}}),$scope.pagesToPublish&&(msg={header:"tab_pages_select_error"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.confirmPageDelete=function($event){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$event.preventDefault(),$id=$scope.page.id,$form={page_id:$id},Restangular.one("portal").one("page").all($id.toString()).customDELETE($form).then(function(success){$.each($scope.pages,function(key,value){value&&value.id==success[0].id&&$scope.pages.splice(key,1)}),$translate(["Page","deleted"]).then(function(value){$scope.p=value.Page,$scope.deleted=value.deleted,msg={header:$scope.p+" "+success[0].name+" "+$scope.deleted},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})},$scope.deleteMultiPage=function($event){$scope.pagesToDelete=[];var $table=$(".admin-table");$table.find("tbody > tr").each(function(){$(this).find(".t-check-box input").prop("checked")&&$scope.pagesToDelete.push($(this).scope().page)}),$scope.pagesToDelete.length?$(".delete-multi-page-modal").modal("show"):(msg={header:"tab_pages_select_error"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},$scope.confirmMultiPageDelete=function($event){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg;for(var i=0;i<$scope.pagesToDelete.length;i++)$id=$scope.pagesToDelete[i].id,$form={page_id:$id},Restangular.one("portal").one("page").one($id.toString()).customDELETE($form).then(function(success){$.each($scope.pages,function(key,value){value&&value.id==success[0].id&&$scope.pages.splice(key,1)}),msg={header:"action_success"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()});$timeout(function(){0==$rootScope.floatingMessage.length&&(msg={header:"tab_pages_delete_message"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},500)},$scope.savePageOrder=function(){msg={loading:!0,loading_message:"in_progress"},$rootScope.floatingMessage=msg,$(".page-item").each(function(){$(this).scope().page.display_priority=$(this).index()+1});for(var i=0;i<$scope.pages.length;i++){var page={};angular.copy($scope.pages[i],page),delete page.path,Restangular.one("portal").one("page").one(page.id.toString()).customPUT(page).then(function(success){},function(failure){msg={header:failure.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})}$timeout(function(){0==$rootScope.floatingMessage.length&&(msg={header:"tab_pages_page_order_save"},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage())},500)},$scope.addMeta=function(){var customMeta={type:"",name:"",content:""};null==$scope.page.meta&&($scope.page.meta=[]),$scope.page.meta.push(customMeta)},$scope.removeMeta=function(index){$scope.page.meta.splice(index,1)},$scope.stripWords=function(path){path=path.replace(/^\/+/g,""),path=path.replace(/^https?:\/\//,""),angular.element("#page-path").val(path)}}]);
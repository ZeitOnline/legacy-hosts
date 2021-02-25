/**
 * ZEIT Cookie Admin
 * Supplies a cookie administration frontend 
 *
 * @author Szuppa, Anika
 * @date 2011-06-08
 * @requires jQuery Version 1.3
 *
 * @copyright (c) 2010 ZEIT ONLINE
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function ($) {

	$.fn.cookieAdmin = function (options) {
		    
		 var options = $.extend({
		      prefixCookie : ['drupal-username','drupal-userid','drupal-useradmin'],
		      adminDivName : "cookie_admin",
		      paramName : "showCookie",
		      cssClassActive: "active_cookie",
		      cssClassInactive: "inactive_cookie",
		      alternativeCookies: ""
		    }, options);
		 
		 
		 //test if cookie value exists
		 testCookie = function(cookieName){		
			 
			 var cookieValue = getCookieValue(cookieName);
			 
			 if(cookieValue != null){				 
				 return(cookieName);
			 }else{
				 return(null);
			 }
		 };
		 
		 //get cookie value by name
		 getCookieValue = function(cookieName){				 
			 return(ZEIT.cookieRead(cookieName));				 
		 };
		 
		//delete cookie value
		 deleteCookie = function(cookieName){	
			 
			 ZEIT.cookieErase(cookieName);	
			 $("#"+cookieName).text("Cookie '"+cookieName+"' geloescht");
			 $("#"+cookieName).addClass(options.cssClassInactive);
			 
			 
		 };
		 
		 //get query parameter
		 getQueryParams	=	function(qs) {
			 qs = qs.split("+").join(" ");
			 var params = 	{},
			        		tokens,
			        		re = /[?&]?([^=]+)=([^&]*)/g;

			 while (tokens = re.exec(qs)) {
			        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			 }

			 return params;
		};
		
		//create HTML for admin div
		createHTML = function(cookieName){
			
		 return("<div id='"+cookieName+"'><a href='#'>Cookie '"+cookieName+"'&nbsp;"+"löschen</a></div>");
						
		};

		//build together div for cookie administration
		buildAdminDiv = function(){
			 
			//grab url get params
			var urlParams = getQueryParams(document.location.search);		 
			var presetCookieName = urlParams[options.paramName];
			
			var getHTML = "";
			var cookieArray = new Array();
			var validCookieName = "";
			
			//search for cookie name
			if(presetCookieName != undefined){
				
				//get full cookie name
				validCookieName = testCookie(presetCookieName);
				
				//create html and push to array
				if(validCookieName != null){
					
					getHTML = createHTML(validCookieName);
					cookieArray.push(validCookieName);	
					
				}
								
			}else{
				
				$.each(options.prefixCookie,function(key,value){	
					
					//get full cookie name
					validCookieName = testCookie(value);
					
					//create html and push to array
					if(validCookieName != null){
						
						getHTML += createHTML(validCookieName);
						cookieArray.push(validCookieName);
						
					}
					
					
				});
				
			} 
			
			//set not found message
			if(getHTML == ""){
				getHTML = "Keine Cookies gefunden!";
			}else{
				$("."+options.adminDivName).addClass(options.cssClassActive);
			}
			
			//append html and add class
			$("."+options.adminDivName).append(getHTML);
					
			//bind click events to all cookie divs
			$.each(cookieArray,function(key,value){
				
				$("#"+value).bind("click",function(){
					deleteCookie(value);
				});
				
			});
							 
		 };
		 
		 return this.each( function() {
			 buildAdminDiv();   	
		 });
		 
	};
		      
}(jQuery));  
   

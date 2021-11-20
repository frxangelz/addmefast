/*
	Addmefast bot - Script
	(c) 2021 - FreeAngel 
		
		youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
		PLEASE SUBSCRIBE !
		
	github : 
*/

const _MAX_LOADING_WAIT_TIME = 30;
const _TIMEOUT_IN_SECS = 60;
const _MAX_TYPE = 12;

const _ACTION_TYPE_TIKTOK_LIKE = 0;
const _ACTION_TYPE_TIKTOK_FOLLOW = 1;
const _ACTION_TYPE_INSTAGRAM_LIKE = 2;
const _ACTION_TYPE_INSTAGRAM_FOLLOW = 3;
const _ACTION_TYPE_FACEBOOK_POST_LIKE = 4;
const _ACTION_TYPE_FACEBOOK_LIKE = 5;
const _ACTION_TYPE_TWITTER_FOLLOW = 6;
const _ACTION_TYPE_TWITTER_LIKE = 7;
const _ACTION_TYPE_YT_SUB = 8;
const _ACTION_TYPE_YT_LIKE = 9;
const _ACTION_TYPE_SC_FOLLOW = 10;
const _ACTION_TYPE_SC_LIKE = 11;

const _TIKTOK_FOLLOW = "https://addmefast.com/free_points/tiktok_followers";
const _TIKTOK_LIKE = "https://addmefast.com/free_points/tiktok_video_likes";
const _INSTAGRAM_FOLLOW = "https://addmefast.com/free_points/instagram";
const _INSTAGRAM_LIKES =  "https://addmefast.com/free_points/instagram_likes";
const _FACEBOOK_POST_LIKE = "https://addmefast.com/free_points/facebook_post_like";
const _FACEBOOK_LIKE = "https://addmefast.com/free_points/facebook_likes";
const _TWITTER_FOLLOW = "https://addmefast.com/free_points/twitter";
const _TWITTER_LIKE = "https://addmefast.com/free_points/twitter_likes";
const _YT_SUB = "https://addmefast.com/free_points/youtube_subscribe";
const _YT_LIKE = "https://addmefast.com/free_points/youtube_likes";
const _SC_FOLLOW = "https://addmefast.com/free_points/soundcloud_follow";
const _SC_LIKE = "https://addmefast.com/free_points/soundcloud_likes";

tick_count = 0;
first = true;

var CurActionUrl = "";

var config = {
	enable : 0,
	max : 0,
	actionType: 0,
}

var tab_id = 0;
var opened_tab_id = 0;
var wait_time = 5;

const _STATE_IDLE = 0;
const _STATE_WAIT = 1; // tidak ngapa2in
const _STATE_TASK_STARTED = 2;
const _STATE_WAIT_TO_CLOSE = 3;  // untuk popup

var state = 0; 	// idle

var click_count = 0;

function clog(s){

		chrome.runtime.sendMessage({action:"log", log: s});
}

var _ENABLE_LIST = [true,true,true,true,true,true,true,true,true,true,true,true];

function nextActionType(){
	
	// get next enable type
	var i = 0;
	var j = config.actionType;
	var cat = -1;
	while((i < _MAX_TYPE) && (cat == -1)) {
		
		i++;
		if(j < _MAX_TYPE-1) { j++ }
		else { j = 0; }
		
		if(_ENABLE_LIST[j]){
			cat = j;
		}
	}
	
	config.actionType = cat;
	switch(cat) {
		case _ACTION_TYPE_TIKTOK_LIKE : CurActionUrl = _TIKTOK_LIKE;
										break;
		
		case _ACTION_TYPE_TIKTOK_FOLLOW : CurActionUrl = _TIKTOK_FOLLOW;
										  break;
									 
		case _ACTION_TYPE_INSTAGRAM_LIKE : CurActionUrl = _INSTAGRAM_LIKES;
										   break;	

		case _ACTION_TYPE_INSTAGRAM_FOLLOW : CurActionUrl = _INSTAGRAM_FOLLOW;
											 break;
											 
		case _ACTION_TYPE_FACEBOOK_POST_LIKE : CurActionUrl = _FACEBOOK_POST_LIKE;
												break;
												
		case _ACTION_TYPE_FACEBOOK_LIKE : CurActionUrl = _FACEBOOK_LIKE;
											break;
		
		case _ACTION_TYPE_TWITTER_FOLLOW : CurActionUrl = _TWITTER_FOLLOW;
			break;
			
		case _ACTION_TYPE_TWITTER_LIKE : CurActionUrl = _TWITTER_LIKE;
			break;
			
		case _ACTION_TYPE_YT_SUB : CurActionUrl = _YT_SUB;
			break;
			
		case _ACTION_TYPE_YT_LIKE : CurActionUrl = _YT_LIKE;
			break;
			
		case _ACTION_TYPE_SC_FOLLOW : CurActionUrl = _SC_FOLLOW;
			break;
			
		case _ACTION_TYPE_SC_LIKE : CurActionUrl = _SC_LIKE;
			break;
											
		default : CurActionUrl = "";
	}
}

function urlToActionType(vurl){
	
	if(vurl == _TIKTOK_LIKE) return _ACTION_TYPE_TIKTOK_LIKE;
	if(vurl == _TIKTOK_FOLLOW) return _ACTION_TYPE_TIKTOK_FOLLOW;
	if(vurl == _INSTAGRAM_LIKES) return _ACTION_TYPE_INSTAGRAM_LIKE;
	if(vurl == _INSTAGRAM_FOLLOW) return _ACTION_TYPE_INSTAGRAM_FOLLOW;
	if(vurl == _FACEBOOK_POST_LIKE) return _ACTION_TYPE_FACEBOOK_POST_LIKE;
	if(vurl == _FACEBOOK_LIKE) return _ACTION_TYPE_FACEBOOK_LIKE;
	if(vurl == _TWITTER_FOLLOW) return _ACTION_TYPE_TWITTER_FOLLOW;
	if(vurl == _TWITTER_LIKE) return _ACTION_TYPE_TWITTER_LIKE;
	if(vurl == _YT_SUB) return _ACTION_TYPE_YT_SUB;
	if(vurl == _YT_LIKE) return _ACTION_TYPE_YT_LIKE;
	if(vurl == _SC_FOLLOW) return _ACTION_TYPE_SC_FOLLOW;
	if(vurl == _SC_LIKE) return _ACTION_TYPE_SC_LIKE;
	return -1;
}

var simulateMouseEvent = function(element, eventName, coordX, coordY) {
	element.dispatchEvent(new MouseEvent(eventName, {
	  view: window,
	  bubbles: true,
	  cancelable: true,
	  clientX: coordX,
	  clientY: coordY,
	  button: 0
	}));
  };
  
  function click(btn){
	  var box = btn.getBoundingClientRect(),
		  coordX = box.left + (box.right - box.left) / 2,
		  coordY = box.top + (box.bottom - box.top) / 2;
		  
	  btn.focus();
	  simulateMouseEvent(btn,"mousemove",coordX,coordY);
	  simulateMouseEvent(btn,"mousedown",coordX,coordY);
	  setTimeout(function(){
		  simulateMouseEvent(btn,"click",coordX,coordY);
		  simulateMouseEvent(btn,"mouseup",coordX,coordY);
	  },200);
  }

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action === "set") {
		config.enable = request.enable;
		config.max = request.max;
		_ENABLE_LIST[0] = request.tiktoklike;
		_ENABLE_LIST[1] = request.tiktokfollow;
		_ENABLE_LIST[2] = request.iglike;
		_ENABLE_LIST[3] = request.igfollow;
		_ENABLE_LIST[4] = request.fbpostlike;
		_ENABLE_LIST[5] = request.fblike;
		_ENABLE_LIST[6] = request.twitterfollow;
		_ENABLE_LIST[7] = request.twitterlike;
		_ENABLE_LIST[8] = request.ytsub;
		_ENABLE_LIST[9] = request.ytlike;
		_ENABLE_LIST[10] = request.scfollow;
		_ENABLE_LIST[11] = request.sclike;

		if(config.enable){
			window.location.href = "https://www.addmefast.com";
			return;
		}
		tick_count = 0;
	}
	
	if (request.action == "opened") {
		
		//tab_id = reqest.ta
		opened_tab_id = request.tabid;
		if(state === _STATE_TASK_STARTED) { wait_time = 300; }
	}

	if (request.action == "closed") {
		
		if(opened_tab_id == request.tabid){
			opened_tab_id = 0;
			state = _STATE_IDLE;
			wait_time = 3;
		}
	}
	
	
});

function removeErrorLike(){

 var div = document.querySelector("div.error_like");
 if (div) {
	 
	 div.parentNode.removeChild(div);
	 wait_time = 10;
 }
}

function checkReloadButton(){
	
	var div = document.querySelector('div.ui-dialog[aria-labelledby="ui-dialog-title-timeout"]');
	if (!div) { return; }
	
	//document.querySelector('input[name="reload"]').click();	
	var btn = document.querySelector('input[name="reload"]');
	if(btn) {
		
		wait_time = 30;
		clog("Addmefast Page Reloaded");
		btn.click();
	}
}

var loading_tick_count = 0;

function isLoading(){
	
	var div = document.querySelector("div#loading-indicator-site-links-list-overlay");
	if(div) { loading_tick_count++; return true; }
	else { loading_tick_count = 0; return false; }
}

 	   var readyStateCheckInterval = setInterval(function() {
	       
		   if (document.readyState !== "complete") { return; }

		   if(first){
				first = false;
				chrome.runtime.sendMessage({action: "get"}, function(response){
	
					config.enable = response.enable;
					config.max = response.max;
					_ENABLE_LIST[0] = response.tiktoklike;
					_ENABLE_LIST[1] = response.tiktokfollow;
					_ENABLE_LIST[2] = response.iglike;
					_ENABLE_LIST[3] = response.igfollow;
					_ENABLE_LIST[4] = response.fbpostlike;
					_ENABLE_LIST[5] = response.fblike;
					_ENABLE_LIST[6] = response.twitterfollow;;
					_ENABLE_LIST[7] = response.twitterlike;
					_ENABLE_LIST[8] = response.ytsub;
					_ENABLE_LIST[9] = response.ytlike;
					_ENABLE_LIST[10] = response.scfollow;
					_ENABLE_LIST[11] = response.sclike;
					
					config.actionType = response.actType;
					tab_id = response.tabid;
				});
		   }

		   if(!config.enable) { return; }
		   
		   cur_url = //$(location).attr('href');		   
					 window.location.href;

           tick_count= tick_count+1; 


		   if(state === _STATE_WAIT_TO_CLOSE){
			
				
				if(wait_time > 0){
					console.log("closing windows in "+wait_time+" seconds");
					wait_time--;
				} else { window.close(); }
				return;
		   }

		   if(cur_url.indexOf("tiktok.com") !== -1){
				do_tiktok();
				return;
		   }

		   if(cur_url.indexOf("instagram.com") !== -1){
				do_instagram();
				return;
		   }
		   
		   if(cur_url.indexOf("facebook.com") !== -1){
			   do_facebook();
			   return;
		   }
		   
		   if(cur_url.indexOf("twitter.com") !== -1){
			   do_twitter();
			   return;
		   }
		   
		   if(cur_url.indexOf("youtube.com") !== -1){
			   do_youtube();
			   return;
		   }
		   
		   if(cur_url.indexOf("soundcloud.com") !== -1){
			   do_soundcloud();
			   return;
		   }
		   
		   if(cur_url.indexOf("addmefast.com") === -1) { return; }
		   
   		   removeErrorLike();

		   if(isLoading()){
			
				console.log("waiting ...");
				if(loading_tick_count >= _MAX_LOADING_WAIT_TIME){
					console.log("wait timeout, next type");
					nextActionType();
					state = _STATE_WAIT;
					wait_time = 30;
					window.location.href = CurActionUrl;
				}
				
				return;
		   }

		   console.log("state : "+state);
		   if(wait_time > 0){
			    // sedang dalam proses menanti
				wait_time--;
				return;
		   }

		   var cat = urlToActionType(cur_url);
		   if(cat === -1){
			   // disable
				console.log("unknown url, get next type");
				nextActionType();
				state = _STATE_WAIT;
				wait_time = 30;
				window.location.href = CurActionUrl;
			   return;
		   }
		   
		   // addmefast often error and ask to reload
		   checkReloadButton();
		   
		   if(config.actionType != cat){
			
			  chrome.runtime.sendMessage({action:"setActType",actType:cat});
		   }
		   
   		   config.actionType = cat;

		   if(state === _STATE_WAIT){
			   
			   // reload page because it's error
			   window.location.href = cur_url;
			   return;
		   }
		   
		   if(state === _STATE_IDLE){
				btn = document.querySelector("div.btn3");
				if(!btn) {
					
					console.log("No Button Found !");
					nextActionType();
					state = _STATE_WAIT;
					wait_time = 30;
					window.location.href = CurActionUrl;
					return;
				}
				
				// click the button
				if(btn.textContent != "Confirm"){
					
					if(click_count >= config.max){
						console.log("MaxClick "+click_count+", next type");
						nextActionType();
						state = _STATE_WAIT;
						wait_time = 30;
						window.location.href = CurActionUrl;
						return;
					}
					
					click_count++;
					state = _STATE_TASK_STARTED;
					wait_time = 120;	// 2 minutes
					chrome.runtime.sendMessage({action:"setActType",actType:config.actionType});
				} else {
					
					wait_time = 5;
				}
				
				btn.click();
				return;
		   }
		   
		   if(state === _STATE_TASK_STARTED){
			   
			   // timeout, set to idle
			   state = _STATE_IDLE;
			   return;
		   }
		   
		   
		   
	 }, 1000);


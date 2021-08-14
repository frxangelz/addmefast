/*
	Addmefast bot - Script
	(c) 2021 - FreeAngel 
		
		youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
		PLEASE SUBSCRIBE !
		
	github : 
*/

const _MAX_LOADING_WAIT_TIME = 30;
const _TIMEOUT_IN_SECS = 60;

const _ACTION_TYPE_TIKTOK_LIKE = 0;
const _ACTION_TYPE_TIKTOK_FOLLOW = 1;
const _ACTION_TYPE_INSTAGRAM_LIKE = 2;
const _ACTION_TYPE_INSTAGRAM_FOLLOW = 3;

const _TIKTOK_FOLLOW = "https://addmefast.com/free_points/tiktok_followers";
const _TIKTOK_LIKE = "https://addmefast.com/free_points/tiktok_video_likes";
const _INSTAGRAM_FOLLOW = "https://addmefast.com/free_points/instagram";
const _INSTAGRAM_LIKES =  "https://addmefast.com/free_points/instagram_likes";

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
var wait_time = 10;

const _STATE_IDLE = 0;
const _STATE_WAIT = 1; // tidak ngapa2in
const _STATE_TASK_STARTED = 2;
const _STATE_WAIT_TO_CLOSE = 3;  // untuk popup

var state = 0; 	// idle

var click_count = 0;

function clog(s){

		chrome.runtime.sendMessage({action:"log", log: s});
}

var _ENABLE_LIST = [true,true,true,true];

function nextActionType(){
	
	// get next enable type
	var i = 0;
	var j = config.actionType;
	var cat = -1;
	while((i < 4) && (cat == -1)) {
		
		i++;
		if(j < 3) { j++ }
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
		default : CurActionUrl = "";
	}
}

function urlToActionType(vurl){
	
	if(vurl == _TIKTOK_LIKE) return _ACTION_TYPE_TIKTOK_LIKE;
	if(vurl == _TIKTOK_FOLLOW) return _ACTION_TYPE_TIKTOK_FOLLOW;
	if(vurl == _INSTAGRAM_LIKES) return _ACTION_TYPE_INSTAGRAM_LIKE;
	if(vurl == _INSTAGRAM_FOLLOW) return _ACTION_TYPE_INSTAGRAM_FOLLOW;
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
			if((config.actionType == _ACTION_TYPE_INSTAGRAM_LIKE) || (config.actionType == _ACTION_TYPE_INSTAGRAM_FOLLOW)) { wait_time = 5; } else { wait_time = 10; }
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


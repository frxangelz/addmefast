var total = 0;
var sub_total = 0; // total action per type

var opened_tab_id = 0;

var config = {
	enable : 0,
	max : 3,
	iglike : true,
	igfollow : true,
	tiktoklike : true,
	tiktokfollow: true,
	fbpostlike: true,
	fblike: true,
	actionType: 3,
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
				
    if (request.action == "set"){
		config.enable = request.enable;
		config.max = parseInt(request.max);
		config.iglike = request.iglike;
		config.igfollow = request.igfollow;
		config.tiktoklike = request.tiktoklike;
		config.tiktokfollow = request.tiktokfollow;
		config.fbpostlike = request.fbpostlike;
		config.fblike = request.fblike;
		send_enable();
		return;
	}
	
	if(request.action == "get"){
		var vtabid = 0;
		if((sender) && (sender.tab) && (sender.tab.id))
			vtabid = sender.tab.id;
		
		var message = {action: "set", 
					   enable: config.enable, 
					   max:config.max, 
					   iglike:config.iglike, 
					   igfollow:config.igfollow, 
					   tiktoklike:config.tiktoklike, 
					   tiktokfollow:config.tiktokfollow, 
					   fbpostlike:config.fbpostlike,
					   fblike:config.fblike,
					   actType:config.actionType, 
					   tabid:vtabid};
		opened_tab_id = vtabid;
		sendResponse(message);
		if(vtabid !== 0)
			send_notify("opened",opened_tab_id);
		return;
	}
	
	if(request.action == "setActType"){
	
		config.actionType = request.actType;
		console.log("actionType set to : "+config.actionType);
		return;
	}
	
	if(request.action == "log"){
		
		console.log(request.log);
		return;
	}
	
 });
 
 function send_enable(){
 
		chrome.tabs.query({}, function(tabs) {
		var message = {action: "set", 
					   enable: config.enable, 
					   max:config.max, 
					   iglike:config.iglike, 
					   igfollow:config.igfollow, 
					   tiktoklike:config.tiktoklike, 
					   tiktokfollow:config.tiktokfollow, 
					   fbpostlike:config.fbpostlike,
					   fblike:config.fblike,
					   actType:config.actionType};
		for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, message);
		}
	}); 
 }
 
function send_notify(vaction, vtabid){
 
		chrome.tabs.query({}, function(tabs) {
		var message = {action: vaction,tabid: vtabid};
		for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, message);
		}
	}); 
 }

 chrome.tabs.onRemoved.addListener(function(tabid, removed) {
	
	if(tabid == opened_tab_id) {
		opened_tab_id = 0;
		send_notify("closed", tabid);
	}
})
 
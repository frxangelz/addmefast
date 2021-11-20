var total = 0;
var sub_total = 0; // total action per type

var opened_tab_id = 0;

var config = {
	enable : 0,
	max : 3,
	iglike : false,
	igfollow : false,
	tiktoklike : false,
	tiktokfollow: false,
	fbpostlike: false,
	fblike: false,
	twitterfollow:false,
	twitterlike:false,
	ytsub:false,
	ytlike:false,
	scfollow:false,
	sclike:false,
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
		config.twitterfollow = request.twitterfollow;
		config.twitterlike = request.twitterlike;
		config.ytsub = request.ytsub;
		config.ytlike = request.ytlike;
		config.scfollow = request.scfollow;
		config.sclike = request.sclike;
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
					   twitterfollow:config.twitterfollow,
					   twitterlike:config.twitterlike,
					   ytsub:config.ytsub,
					   ytlike:config.ytlike,
					   scfollow:config.scfollow,
					   sclike:config.sclike,
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
					   twitterfollow:config.twitterfollow,
					   twitterlike:config.twitterlike,
					   ytsub:config.ytsub,
					   ytlike:config.ytlike,
					   scfollow:config.scfollow,
					   sclike:config.sclike,
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

/* config from storage */
 	chrome.storage.sync.get('max', function(data) {
		if((data.max) && (data.max != 0)){
			config.max = data.max;
			console.log("Max From config : "+config.max);
		}
	});
 
 	chrome.storage.sync.get('iglike', function(data) {
		if((data.iglike) && (data.iglike != 0)){
			config.iglike = data.iglike;
			console.log("iglike From config : "+config.iglike);
		}
	});

 	chrome.storage.sync.get('igfollow', function(data) {
		if((data.igfollow) && (data.igfollow != 0)){
			config.igfollow = data.igfollow;
			console.log("igfollow From config : "+config.igfollow);
		}
	});

 	chrome.storage.sync.get('tiktoklike', function(data) {
		if((data.tiktoklike) && (data.tiktoklike != 0)){
			config.tiktoklike = data.tiktoklike;
			console.log("tiktoklike From config : "+config.tiktoklike);
		}
	});

 	chrome.storage.sync.get('tiktokfollow', function(data) {
		if((data.tiktokfollow) && (data.tiktokfollow != 0)){
			config.tiktokfollow = data.tiktokfollow;
			console.log("tiktokfollow From config : "+config.tiktokfollow);
		}
	});

 	chrome.storage.sync.get('fbpostlike', function(data) {
		if((data.fbpostlike) && (data.fbpostlike != 0)){
			config.fbpostlike = data.fbpostlike;
			console.log("fbpostlike From config : "+config.fbpostlike);
		}
	});

 	chrome.storage.sync.get('fblike', function(data) {
		if((data.fblike) && (data.fblike != 0)){
			config.fblike = data.fblike;
			console.log("fblike From config : "+config.fblike);
		}
	});

 	chrome.storage.sync.get('twitterfollow', function(data) {
		if((data.twitterfollow) && (data.twitterfollow != 0)){
			config.twitterfollow = data.twitterfollow;
			console.log("twitterfollow From config : "+config.twitterfollow);
		}
	});

 	chrome.storage.sync.get('twitterlike', function(data) {
		if((data.twitterlike) && (data.twitterlike != 0)){
			config.twitterlike = data.twitterlike;
			console.log("twitterlike From config : "+config.twitterlike);
		}
	});

 	chrome.storage.sync.get('ytsub', function(data) {
		if((data.ytsub) && (data.ytsub != 0)){
			config.ytsub = data.ytsub;
			console.log("ytsub From config : "+config.ytsub);
		}
	});

 	chrome.storage.sync.get('ytlike', function(data) {
		if((data.ytlike) && (data.ytlike != 0)){
			config.ytlike = data.ytlike;
			console.log("ytlike From config : "+config.ytlike);
		}
	});

 	chrome.storage.sync.get('scfollow', function(data) {
		if((data.scfollow) && (data.scfollow != 0)){
			config.scfollow = data.scfollow;
			console.log("scfollow From config : "+config.scfollow);
		}
	});

 	chrome.storage.sync.get('sclike', function(data) {
		if((data.sclike) && (data.sclike != 0)){
			config.sclike = data.sclike;
			console.log("sclike From config : "+config.sclike);
		}
	});


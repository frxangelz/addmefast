var config = {
	enable : 0,
	max : 0,
	iglike: false,
	igfollow: false,
	tiktoklike: false,
	tiktokfollow: false,
	fbpostlike: false,
	fblike: false,
	twitterfollow: false,
	twitterlike: false,
	ytsub: false,
	ytlike: false,
	scfollow: false,
	sclike: false
}

$(document).ready(function(){
	$("btn#start").click(function(){
		var txt = $(this).text();
		if (txt==="Start"){

			config.max = $('#maxclick').val();
			config.iglike = $("#iglike").is(":checked");
			config.igfollow = $("#igfollow").is(":checked");
			config.tiktoklike = $("#tiktoklike").is(":checked");
			config.tiktokfollow = $("#tiktokfollow").is(":checked");
			config.fbpostlike = $("#fbpostlike").is(":checked");
			config.fblike = $("#fblike").is(":checked");
			config.twitterfollow = $("#twitterfollow").is(":checked");
			config.twitterlike = $("#twitterlike").is(":checked");
			config.ytsub = $("#ytsub").is(":checked");
			config.ytlike = $("#ytlike").is(":checked");
			config.scfollow = $("#scfollow").is(":checked");
			config.sclike = $("#sclike").is(":checked");

			if((!config.iglike) && (!config.igfollow) && (!config.tiktoklike) && (!config.tiktokfollow) && (!config.fblike) && 
			   (!config.fbpostlike) && (!config.twitterfollow) && (!config.twitterlike) && (!config.ytsub) && (!config.ytlike) &&
			  (!config.scfollow) && (!config.sclike)){
				return;
			}

			config.enable = 1;
			$(this).text("Stop");
			$(this).removeClass("btn-success");
			$(this).addClass("btn-danger");
			
			chrome.storage.sync.set({max:config.max, iglike: config.iglike, igfollow: config.igfollow, tiktoklike:config.tiktoklike,
									tiktokfollow:config.tiktokfollow, fbpostlike:config.fbpostlike,fblike:config.fblike,
									twitterfollow:config.twitterfollow, twitterlike:config.twitterlike,ytsub:config.ytsub,ytlike:config.ytlike,
									scfollow:config.scfollow,sclike:config.sclike});
			
		} else {
			$(this).text("Start");
			$(this).removeClass("btn-danger");
			$(this).addClass("btn-success");
			config.enable = 0;
		}

		set_status();
	});
	
	get_status();
	//setInterval(get_status,1000);
});	

function set_status(){
	
	EnableControls(config.enable ? true : false);
	chrome.runtime.sendMessage({action: "set",
			enable: config.enable,
			max: config.max,
			iglike: config.iglike,
			igfollow: config.igfollow,
			tiktoklike: config.tiktoklike,
			tiktokfollow: config.tiktokfollow,
			fbpostlike: config.fbpostlike,
			fblike: config.fblike,
			twitterfollow: config.twitterfollow,
			twitterlike: config.twitterlike,
			ytsub: config.ytsub,
			ytlike: config.ytlike,
			scfollow: config.scfollow,
			sclike: config.sclike
		}, function(response){});		

}

function get_status(){
	var $b = $("btn#start");

	chrome.runtime.sendMessage({action: "get"}, function(response){
	
		config.enable = response.enable;
		config.max = response.max;
		config.iglike = response.iglike;
		config.igfollow = response.igfollow;
		config.tiktoklike = response.tiktoklike;
		config.tiktokfollow = response.tiktokfollow;
		config.fbpostlike = response.fbpostlike;
		config.fblike = response.fblike;
		config.twitterfollow = response.twitterfollow;
		config.twitterlike = response.twitterlike;
		config.ytsub = response.ytsub;
		config.ytlike = response.ytlike;
		config.scfollow = response.scfollow;
		config.sclike = response.sclike;
		
		if (config.enable == 0){
			$b.text("Start");
			$b.removeClass("btn-danger");
			$b.addClass("btn-success");
		} else {
			$b.text("Stop");
			$b.removeClass("btn-success");
			$b.addClass("btn-danger");
		}
		
		$('#maxclick').val(config.max);
		$('#iglike').prop("checked",config.iglike);
		$('#igfollow').prop("checked",config.igfollow);
		$('#tiktoklike').prop("checked",config.tiktoklike);
		$('#tiktokfollow').prop("checked",config.tiktokfollow);
		$('#fbpostlike').prop("checked",config.fbpostlike);
		$('#fblike').prop("checked",config.fblike);
		$('#twitterfollow').prop("checked",config.twitterfollow);
		$('#twitterlike').prop("checked",config.twitterlike);
		$('#ytsub').prop("checked",config.ytsub);
		$('#ytlike').prop("checked",config.ytlike);
		$('#scfollow').prop("checked",config.scfollow);
		$('#sclike').prop("checked",config.sclike);
		
		EnableControls(config.enable ? true : false);
		
	});
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

	if(request.action === "count"){
		$("btn#count").text(request.value);
		if(request.enable != 1){
		  var $b = $("btn#start");
		  $b.removeClass("btn-danger");
		  $b.addClass("btn-success");
		  $b.text("Start");
		}
		return;
	}
});

function EnableControls(val){
		$('#maxclick').prop("disabled",val);
		$('#iglike').prop("disabled",val);
		$('#igfollow').prop("disabled",val);
		$('#tiktoklike').prop("disabled",val);
		$('#tiktokfollow').prop("disabled",val);
		$('#fbpostlike').prop("disabled",val);
		$('#fblike').prop("disabled",val);
		$('#twitterfollow').prop("disabled",val);
		$('#twitterlike').prop("disabled",val);
		$('#ytsub').prop("disabled",val);
		$('#ytlike').prop("disabled",val);
		$('#scfollow').prop("disabled",val);
		$('#sclike').prop("disabled",val);
}
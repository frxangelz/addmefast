var config = {
	enable : 0,
	max : 0,
	iglike: false,
	igfollow: false,
	tiktoklike: false,
	tiktokfollow: false,
	fbpostlike: true,
	fblike: true
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

			if((!config.iglike) && (!config.igfollow) && (!config.tiktoklike) && (!config.tiktokfollow) && (!config.fblike) && (!config.fbpostlike)){
				return;
			}

			config.enable = 1;
			$(this).text("Stop");
			$(this).removeClass("btn-success");
			$(this).addClass("btn-danger");
			
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
	
	chrome.runtime.sendMessage({action: "set",
			enable: config.enable,
			max: config.max,
			iglike: config.iglike,
			igfollow: config.igfollow,
			tiktoklike: config.tiktoklike,
			tiktokfollow: config.tiktokfollow,
			fbpostlike: config.fbpostlike,
			fblike: config.fblike
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

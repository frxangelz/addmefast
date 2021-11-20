function do_tiktok_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	// engagement-icon-v23
	var div = document.querySelectorAll('div.engagement-icon-v23');
	if((!div) || (div.length < 1)){
		div = document.querySelectorAll('span[data-e2e="like-icon"');
	}
	
	if ((div) && (div.length > 0)){
		console.log("Clicked !");
		//div[0].click();
		click(div[0]);
		return true;
	}
	
	return false;
}

function do_tiktok_follow(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var btns = document.getElementsByTagName("button");
	if(!btns) { return false; }
	if(btns.length < 1) { return false; }

	//btns[0].click();
	for(var i=0; i<btns.length; i++){
		if(btns[i].textContent == "Follow") {

			//btns[i].click();
			click(btns[i]);
			return true;
		}
	}	
}

var tiktok_done = false;

function do_tiktok(){
	
	// wait for 5 seconds
	if(tick_count < 2) { return; }
	
	if(tick_count > _TIMEOUT_IN_SECS) {
		// timeout
		window.close();
	}

	if(tiktok_done) { return; }
	
	tiktok_done = true;
	console.log("config.actionType = "+config.actionType);
	
	if (config.actionType === _ACTION_TYPE_TIKTOK_LIKE) {
		
		do_tiktok_like();
		return;
	}
	
	if (config.actionType === _ACTION_TYPE_TIKTOK_FOLLOW) {
		do_tiktok_follow();
		return;
	}
}
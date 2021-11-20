function do_sc_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;
	
	var div = document.querySelector('button.sc-button-like');
	if(!div) { 
		console.log("like button not found !");
		return; 
	}
	
	div.click();
	
}

function do_sc_follow(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var div = document.querySelector('button.sc-button-follow');
	if(!div) { 
		console.log("follow button not found !");
		return; 
	}
	
	div.click();
}

var soundcloud_done = false;

function do_soundcloud(){
	
	// wait for 5 seconds
	if(tick_count < 2) { return; }
	
	if(tick_count > _TIMEOUT_IN_SECS) {
		// timeout
		window.close();
	}

	if(soundcloud_done) { return; }
	soundcloud_done = true;
	
	console.log("soundcloud_done");
	console.log("config.actionType = "+config.actionType);
	
	if (config.actionType === _ACTION_TYPE_SC_FOLLOW) {
		
		console.log("do_sc_follow");
		do_sc_follow();
		return;
	}
	
	if (config.actionType === _ACTION_TYPE_SC_LIKE) {
		console.log("do_sc_like");
		do_sc_like();
		return;
	}
}
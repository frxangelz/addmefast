function do_yt_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;
	
	btn = document.querySelector('button[aria-label^="like"');
	if(btn){
		btn.click();	
	} else {
		console.log("like button not found !");
	}
}

function do_yt_sub(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var buttons = document.querySelectorAll('.ytd-subscribe-button-renderer');
	if((!buttons) || (buttons.length < 1)){ 
		console.log("No Subscribe button found :()");
		return; 
	}
	
	for(var i=0; i<buttons.length; i++){
 		var s = buttons[i].textContent;
 		if (s==='Subscribe'){
			buttons[i].click();
			break;
 		}
	}
}

var youtube_done = false;

function do_youtube(){
	
	// wait for 5 seconds
	if(tick_count < 2) { return; }
	
	if(tick_count > _TIMEOUT_IN_SECS) {
		// timeout
		window.close();
	}

	if(youtube_done) { return; }
	youtube_done = true;
	
	console.log("youtube_done");
	console.log("config.actionType = "+config.actionType);
	
	if (config.actionType === _ACTION_TYPE_YT_SUB) {
		
		console.log("do_yt_sub");
		do_yt_sub();
		return;
	}
	
	if (config.actionType === _ACTION_TYPE_YT_LIKE) {
		console.log("do_yt_like");
		do_yt_like();
		return;
	}
}
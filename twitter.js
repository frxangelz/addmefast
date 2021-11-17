// JavaScript Document
function do_twitter_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var div = document.querySelector('div[data-testid="confirmationSheetConfirm"]');
	if((div) && (div.textContent==="Like")){
		div.click();
		return true;
	}
	
	div = document.querySelector('div[aria-label="Like"]');	
	
	if (div){
		div.click();
		return true;
	}
	
	return false;
}

function do_twitter_follow(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var div = document.querySelector('div[data-testid="confirmationSheetConfirm"]');
	if(!div){
		div = document.querySelector('div[aria-label^="Follow @"]');
	}
	
	var tc = '';
	if(div){
		tc = div.textContent;
		if(tc === "Follow"){
			div.click();
		} else {
			console.log("invalid confirmation sheet")
		}
		
		return true;
	}
	
	return false;
}

var twitter_done = false;

function do_twitter(){
	
	// wait for 5 seconds
	if(tick_count < 2) { return; }
	
	if(tick_count > _TIMEOUT_IN_SECS) {
		// timeout
		window.close();
	}

	if(twitter_done) { return; }
	
	twitter_done = true;
	console.log("config.actionType = "+config.actionType);
	
	if (config.actionType === _ACTION_TYPE_TWITTER_LIKE) {
		
		do_twitter_like();
		return;
	}
	
	if (config.actionType === _ACTION_TYPE_TWITTER_FOLLOW) {
		do_twitter_follow();
		return;
	}
}
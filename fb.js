function do_fb_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;
	
	var section = document.querySelector('div[aria-label="like button"]');
	if(!section) { console.log("section not found !"); return; }
	
	//if(section.querySelector("div._5u9t")) { console.log("already liked"); return; }
	
	var s = "";
	var div = section.querySelectorAll('div[data-nt="FB:TEXT4"]');
	if(!div) { console.log("FB:TEXT4 not found !"); }
	
	for(var i=0; i<div.length; i++){

		s = div[i].textContent;
		if(s === "Like"){
			
			// check for class 'div._5u9t' di parent
			var b = false;
			var dv = div[i].parentElement;
			while ((dv) && (dv !== section)) {
			
				if(dv.className.indexOf("_5u9t") !== -1){
					b = true;
					break;
				}
				
				dv = dv.parentElement;
			}
			
			if(!b) { div[i].click(); } else { console.log("already liked!"); }
			return;
		}
	}
}

function do_fb_post_like(){

	state = _STATE_WAIT_TO_CLOSE;
	wait_time = 6;

	var div = document.querySelector('div[aria-label="Remove Like"]');
	if(div) { return; }
	
	var div = document.querySelector('div[aria-label="Like"]');
	if(!div) { return; }
	div.click();
}

var facebook_done = false;

function do_facebook(){
	
	// wait for 5 seconds
	if(tick_count < 2) { return; }
	
	if(tick_count > _TIMEOUT_IN_SECS) {
		// timeout
		window.close();
	}

	if(facebook_done) { return; }
	facebook_done = true;
	
	console.log("do_facebook");
	console.log("config.actionType = "+config.actionType);
	
	if (config.actionType === _ACTION_TYPE_FACEBOOK_POST_LIKE) {
		
		console.log("do_fb_post_like");
		do_fb_post_like();
		return;
	}
	
	if (config.actionType === _ACTION_TYPE_FACEBOOK_LIKE) {
		console.log("do_fb_like");
		do_fb_like();
		return;
	}
}
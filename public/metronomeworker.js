

onmessage=function(e){
	var timerID=null;
	var interval=100;
	if (e.data==="start") {
		console.log("starting");
		timerID=setInterval(function(){postMessage("tick");},interval)
	}
	else if (e.data.interval) {
		console.log("setting interval");
		interval=e.data.interval;
		console.log("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval)
		}
	}
	else if (e.data==="stop") {
		console.log("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};

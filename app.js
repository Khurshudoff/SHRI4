var json = require('./events.json');
var events = json.events;

var typesSet = new Set([])
events.forEach(function(event){
	typesSet.add(event.type);
})

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

app.post('/status', function (req, res) {
	var time = process.uptime();
    var uptime = (time + "").toHHMMSS();
  	res.send(uptime);
});

app.post('/api/events', function(req, res) {

	//flag of incorrect type
	let incorrectType = false

	typesUserSet = new Set(req.body.type.split(':'));

	//check if types taken from user are valid
	typesUserSet.forEach(function(type){
		if(!typesSet.has(type)){
			incorrectType = true;
		}
	})

	// if input type incorrect then send 400
	if(incorrectType){
		res.status(400).send('incorrect type');
	} else {
		// create events which will be send as a result
		let new_events = {}
		new_events.events = [];

		// add to result events if event belongs to user type
		events.forEach(function(event) {
			if(typesUserSet.has(event.type)){
				new_events.events.push(event);
			}
		});

		//selecting events by page and number of events on page
		if('eventsOnPage' in req.body){
			new_events.events = new_events.events.slice(req.body.eventsOnPage * (req.body.numberOfPage - 1),
										  req.body.eventsOnPage * req.body.numberOfPage)
		}

		//check if index are out of range
		if(new_events.events.length === 0){
			res.status(416).send('indexes out of range')
		} else {
			res.send(JSON.stringify(new_events));
		}
	}

})

app.get('*', function(req, res) {
	res.status(404).send('<h1>Page not found</h1>');
})

app.listen(8000, function () {
  console.log('listening on port 8000!');
});
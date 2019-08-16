var express = require('express');
var app = express();
/*var path = require('path');*/
var awsCli = require('aws-cli-js');

var Options = awsCli.Options;
var Aws = awsCli.Aws;
var options = new Options(
	/* accessKey    */ '',
	/* secretKey    */ '',
	/* sessionToken */ '',
	/* currentWorkingDirectory*/  null
);
var AWS = new Aws(options);

/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'));
});
*/

app.get('/queryForecast', function (req, res) {
    console.log('New forecast requested:')
    console.log('+ Start date: ' + req.query.start_date);
    console.log('+ End date: ' + req.query.end_date);
    console.log('+ Item ID: ' + req.query.item_id);
    command = 'forecastquery query-forecast --forecast-arn arn:aws:forecast:us-east-1:889960878219:forecast/workshop_forecastdemo_1_ets_aml_algo_forecast';
    command = command + ' --start-date "' + req.query.start_date + '"';
    command = command + ' --end-date "' + req.query.end_date + '"';
    command = command + ' --filter item_id=' + req.query.item_id;
    AWS.command(command, function (err, data) {
        if (err == null) {
            res.send(data.object);
        } else {
            res.status(500);
            res.send(err);
        }
    });
});

/*
app.use(express.static('web'));
*/

app.listen(3000, function () {
    console.log('Backend for the Forecast Demo Application is running on port 3000!');
});
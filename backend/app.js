var express = require('express');
var app = express();
var cors = require('cors');
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

app.get('/historicalData', function (req, res) {
    console.log('Historical data requested:')
    console.log('+ Start date: ' + req.query.start_date);
    console.log('+ End date: ' + req.query.end_date);
    console.log('+ Item ID: ' + req.query.item_id);
    command = 's3 cp s3://rodzanto2019ml/elec_data/item-demand-time.csv -';
    AWS.command(command, function (err, data) {
        response = [];
        if (err == null) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            if (data.raw != null) {
                records = data.raw.split('\n');
                startDate = new Date(req.query.start_date);
                endDate = new Date(req.query.end_date);
                for (var i=0; i<records.length; i++) {
                    record = records[i].split(',');
                    recordDate = new Date(record[0].replace(' ','T')+'Z');
                    if (recordDate >= startDate && recordDate <= endDate && record[2] == req.query.item_id) {
                        response.push({Timestamp: record[0].replace(' ','T'), Value: record[1]});
                    }
                }
            }
            res.send({data: response});
        } else {
            res.status(500);
            res.send(err);
        }
    });
});

app.get('/queryForecast', function (req, res) {
    console.log('New forecast requested:')
    console.log('+ Start date: ' + req.query.start_date);
    console.log('+ End date: ' + req.query.end_date);
    console.log('+ Item ID: ' + req.query.item_id);
    command = 'forecastquery query-forecast --forecast-arn arn:aws:forecast:us-east-1:889960878219:forecast/forecast_demo2';
    if (new Date(req.query.start_date) < new Date('2015-01-01T01:00:00Z')) {
        command = command + ' --start-date "' + '2015-01-01T01:00:00Z' + '"';
    } else {
        command = command + ' --start-date "' + req.query.start_date + '"';
    }
    if (new Date(req.query.end_date) > new Date('2015-01-03T00:00:00Z')) {
        command = command + ' --end-date "' + '2015-01-03T00:00:00Z' + '"';
    } else {
        command = command + ' --end-date "' + req.query.end_date + '"';
    }
    command = command + ' --filter item_id=' + req.query.item_id;
    AWS.command(command, function (err, data) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
app.use(cors());
app.listen(3000, function () {
    console.log('Backend for the Forecast Demo Application is running on port 3000!');
});
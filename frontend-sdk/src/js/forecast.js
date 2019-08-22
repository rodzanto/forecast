/*********************************************************************/
/***************************  Forecast  ******************************/
/*********************************************************************/
// var endpointForecastDemo = 'http://localhost:8000'
// var endpointForecastDemo = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2].split(":")[0] + ":3000";

/****************************  AWS SDK  ******************************/
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials(
	/* accessKey    */ 'ASIA46NONKCF4SZQ6PUG',
	/* secretKey    */ 'X9f5ml0aIHo7g0vjNhD4lx86iidPT7gA0oCkZq/j',
	/* sessionToken */ 'FQoGZXIvYXdzEE0aDLvvjBEZl0dvQcFyNiLzARiNJt5ykAnPCuOP4DKDREsyQVnV68EtDDjXqKT4Tuv1S9xz8fdV8zHVLUOADyfO16SQGQHgVqcbsoZgxta3LPm9cg0EViW709kc3zGUW45Im44OgQjt+ps/6X5SPlsLVnwwEJRm9mVa1uOSeSWDAYm8PRcvjSm1umU7FQbn30FYktmotM5oBso7iPV9LePnd813FVGkHjRqNGzYSDSKYLHgL/0igruQnXr2+HlK1HwemlkPET7hqptZ6SibGCt8SjW7udmvU6TT/w5ITABd/E+Hng8Nf6Uyi0gNA7BGjtAYqSAlin2IvkL8/nSmg+AW4KVevyjF9vnqBQ=='
);
forecastARN = 'arn:aws:forecast:us-east-1:889960878219:forecast/forecast_demo2';

/***********************  Forecast Functions  ************************/
var lineChart = null, drawChart = null;
var responseHistoricalData = null, responseForecast = null;

function getChartData() {
    $('#modal-loading').modal('show');
    if (lineChart != null) {
        lineChart.clear();
        lineChart.destroy();
    }
    $('#forecast-chart').css('display', 'none');
	var startDate = $('#start-date').data('daterangepicker').startDate.format('YYYY-MM-DDTHH:mm:ss');
    var endDate = $('#end-date').data('daterangepicker').endDate.format('YYYY-MM-DDTHH:mm:ss');
    var itemId = $('#forecast-key').val();
    responseHistoricalData = null;
    getHistoricalData(startDate, endDate, itemId);
    responseForecast = null;
    //getForecast(startDate, endDate, itemId);
    drawChart = setInterval(drawForecast, 1000);
}

function drawForecast() {
    if (responseHistoricalData != null && responseHistoricalData.length > 0
            /*&& responseForecast != null && typeof(responseForecast.Forecast) !== "undefined"*/) {
        clearInterval(drawChart);
        $('#forecast-chart').css('display', 'block');
        var labels = [], historical = [], mean = [], p10 = [], p50 = [], p90 = [], draw_data = [];
        if (responseHistoricalData != null) {
            for (var i=0; i<responseHistoricalData.length; i++) {
                labels.push(moment(responseHistoricalData[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                historical.push(responseHistoricalData[i].Value);
                mean.push(NaN);
                p10.push(NaN);
                p50.push(NaN);
                p90.push(NaN);
            }
            draw_data.push({
                label: "Historical",
                backgroundColor: "rgba(248, 169, 45, 0)",
                borderColor: "rgba(248, 169, 45, 0.7)",
                pointBorderColor: "rgba(248, 169, 45, 0.7)",
                pointBackgroundColor: "rgba(248, 169, 45, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(248, 169, 45, 1)",
                pointBorderWidth: 1,
                data: historical
            })
        }
        /*
        var foundForecastLabels = false;
        var predictions = responseForecast.Forecast.Predictions;
        if (predictions.mean != null) {
            for (var i=0; i<predictions.mean.length; i++) {
                labels.push(moment(predictions.mean[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                mean.push(predictions.mean[i].Value);
            }
            draw_data.push({
                label: "Mean",
                backgroundColor: "rgba(132, 94, 202, 0)",
                borderColor: "rgba(132, 94, 202, 0.7)",
                pointBorderColor: "rgba(132, 94, 202, 0.7)",
                pointBackgroundColor: "rgba(132, 94, 202, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(132, 94, 202, 1)",
                pointBorderWidth: 1,
                data: mean
            });
            foundForecastLabels = true;
        }
        if (predictions.p10 != null) {
            for (var i=0; i<predictions.p10.length; i++) {
                if (!foundForecastLabels) {
                    labels.push(moment(predictions.p10[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                }
                p10.push(predictions.p10[i].Value);
            }
            draw_data.push({
                label: "P10",
                backgroundColor: "rgba(0, 255, 0, 0)",
                borderColor: "rgba(0, 255, 0, 0.70)",
                pointBorderColor: "rgba(0, 255, 0, 0.70)",
                pointBackgroundColor: "rgba(0, 255, 0, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(0, 255, 0, 1)",
                pointBorderWidth: 1,
                data: p10
            });
            foundForecastLabels = true;
        }
        if (predictions.p50 != null) {
            for (var i=0; i<predictions.p50.length; i++) {
                if (labels.length == 0) {
                    labels.push(moment(predictions.p50[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                }
                p50.push(predictions.p50[i].Value);
            }
            draw_data.push({
                label: "P50",
                backgroundColor: "rgba(0, 0, 255, 0)",
                borderColor: "rgba(0, 0, 255, 0.70)",
                pointBorderColor: "rgba(0, 0, 255, 0.70)",
                pointBackgroundColor: "rgba(0, 0, 255, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(0, 0, 255, 1)",
                pointBorderWidth: 1,
                data: p50
            });
            foundForecastLabels = true;
        }
        if (predictions.p90 != null) {
            for (var i=0; i<predictions.p90.length; i++) {
                if (labels.length == 0) {
                    labels.push(moment(predictions.p90[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                }
                p90.push(predictions.p90[i].Value);
            }
            draw_data.push({
                label: "P90",
                backgroundColor: "rgba(255, 0, 0, 0)",
                borderColor: "rgba(255, 0, 0, 0.70)",
                pointBorderColor: "rgba(255, 0, 0, 0.70)",
                pointBackgroundColor: "rgba(255, 0, 0, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255, 0, 0, 1)",
                pointBorderWidth: 1,
                data: p90
            });
            foundForecastLabels = true;
        }*/
        var ctx = document.getElementById("forecast-chart");
        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: draw_data
            },
        });
        $('#modal-loading').modal('hide');
    }
    /*else if ((responseHistoricalData != null && typeof(responseHistoricalData.data) === "undefined")
                || (responseForecast != null && typeof(responseForecast.Forecast) === "undefined")) {
        lineChart = null;
        clearInterval(drawChart);
        $('#modal-loading').modal('hide');
    }*/
}

function getHistoricalData(startDate, endDate, itemId) {
    responseHistoricalData = null;
    var s3Service = new AWS.S3({region: 'eu-west-1'});
    var params = {
        Bucket: 'rodzanto2019ml/elec_data',
        Key: 'item-demand-time.csv'
    };
    s3Service.getObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            responseHistoricalData = [];
        } else {
            var raw = data.Body.toString('utf-8');
            responseHistoricalData = [];
            if (raw != null) {
                var records = raw.split('\n');
                var dStartDate = new Date(startDate + 'Z');
                var dEndDate = new Date(endDate + 'Z');
                for (var i=0; i<records.length; i++) {
                    var record = records[i].split(',');
                    var recordDate = new Date(record[0].replace(' ','T')+'Z');
                    if (recordDate >= dStartDate && recordDate <= dEndDate && record[2] == itemId) {
                        responseHistoricalData.push({Timestamp: record[0].replace(' ','T'), Value: record[1]});
                    }
                }
            }
        }
    });
}

function getForecast(startDate, endDate, itemId) {
    responseForecast = null;
    var forecastQueryService = new  AWS.ForecastQueryService({region: 'us-east-1'});
    var params = {
        Filters: {
          'item_id': itemId,
        },
        ForecastArn: forecastARN,
        StartDate: startDate + 'Z',
        EndDate: endDate + 'Z'
    };
    forecastQueryService.queryForecast(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            responseForecast = [];
        } else {
            console.log(data);
            responseForecast = data.object;
        }
    });
}


/****************************  On Ready  *****************************/
$(function() {
	// Start date
	$('#start-date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: true,
        timePicker24Hour: true,
        minYear: 2010,
        maxYear: parseInt(moment().format('YYYY'), 10),
		locale: {
			format: 'YYYY/MM/DD HH:mm'
		}
    });
    // End date
	$('#end-date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        timePicker: true,
        timePicker24Hour: true,
        minYear: 2010,
        maxYear: parseInt(moment().format('YYYY'), 10),
		locale: {
			format: 'YYYY/MM/DD HH:mm'
		}
    });
    // Get Forecast Button
    $('#get-forecast').on('click', function(e) {
        getChartData();
        e.preventDefault();
    });
    // Add canvas
    $('#root').after(
        '<div id="div-forecast-chart" class="row">' +
        '   <div class="col-10 offset-1">' +
        '       <canvas id="forecast-chart" width="100%" style="background-color: white; border-radius: 10px; display: none"></canvas>' +
        '   </div>' +
        '</div>')
    // Sign Out
    $('#root button span:contains("Sign Out")').parent().on('click', function(e) {
        $('#div-forecast-chart').remove();
    });
});
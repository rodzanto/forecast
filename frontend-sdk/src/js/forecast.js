/*********************************************************************/
/***************************  Forecast  ******************************/
/*********************************************************************/
// var endpointForecastDemo = 'http://localhost:8000'
// var endpointForecastDemo = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2].split(":")[0] + ":3000";

/****************************  AWS SDK  ******************************/
awsRegion = 'eu-west-1';
awsAccessKeyId = '';
awsSecretKey = '';
awsForecastARN = '';
awsS3Bucket = '';
awsS3Key = '';

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
    var locationId = $('#forecast-key2').val();
    responseHistoricalData = null;
    getHistoricalData(startDate, endDate, itemId, locationId);
    responseForecast = null;
    getForecast(startDate, endDate, itemId, locationId);
    drawChart = setInterval(drawForecast, 1000);
}

function drawForecast() {
    if (responseHistoricalData != null && responseHistoricalData.length > 0
            && responseForecast != null && typeof(responseForecast.Forecast) !== "undefined") {
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
        }
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
    else if ((responseHistoricalData != null && typeof(responseHistoricalData.data) === "undefined")
                || (responseForecast != null && typeof(responseForecast.Forecast) === "undefined")) {
        lineChart = null;
        clearInterval(drawChart);
        $('#modal-loading').modal('hide');
    }
}

function getHistoricalData(startDate, endDate, itemId, locationId) {
    responseHistoricalData = null;
    var s3Service = new AWS.S3({accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretKey, region: awsRegion});
    var params = {
        Bucket: awsS3Bucket,
        Key: awsS3Key
    };
    s3Service.getObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            responseHistoricalData = [];
        } else {
            var raw = data.Body.toString('utf-8');
            console.log(raw);
            responseHistoricalData = [];
            if (raw != null) {
                var records = raw.split('\n');
                var dStartDate = new Date(startDate + 'Z');
                var dEndDate = new Date(endDate + 'Z');
                for (var i=0; i<records.length; i++) {
                    var record = records[i].split(',');
                    var recordDate = null;
                    if (record[1] != null) {
                        recordDate = new Date(record[1].replace(' ','T')+'Z');
                    }
                    if (recordDate != null && recordDate >= dStartDate && recordDate <= dEndDate && record[0] == itemId && record[3] == locationId) {
                        responseHistoricalData.push({Timestamp: record[1].replace(' ','T'), Value: record[2]});
                    }
                }
            }
        }
    });
}

function getForecast(startDate, endDate, itemId, locationId) {
    responseForecast = null;
    var sStartDate = startDate + 'Z';
    var sEndDate = endDate + 'Z';
    if (new Date(sStartDate) < new Date('2019-08-31T00:00:00Z')) {
        sStartDate = '2019-08-31T01:00:00Z';
    }
    if (new Date(sEndDate) > new Date('2019-10-04T00:00:00Z')) {
        sEndDate = '2019-10-04T00:00:00Z';
    } 
    var forecastQueryService = new AWS.ForecastQueryService({accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretKey, region: awsRegion});
    var params = {
        Filters: {
          'item_id': itemId,
          'location': locationId
        },
        ForecastArn: awsForecastARN,
        StartDate: sStartDate,
        EndDate: sEndDate
    };
    forecastQueryService.queryForecast(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            responseForecast = [];
        } else {
            console.log(data);
            responseForecast = data;
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
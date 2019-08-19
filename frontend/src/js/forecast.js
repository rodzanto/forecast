/*********************************************************************/
/***************************  Forecast  ******************************/
/*********************************************************************/
var endpointForecastDemo = 'http://localhost:3000'
var lineChart = null, drawChart = null;
var responseHistoricalData = null, responseForecast = null;

function getChartData() {
    $('#modal-loading').modal('show');
    if (lineChart != null) {
        lineChart.clear();
        lineChart.destroy();
    }
    $('#forecast-chart').css('display', 'none');
	startDate = $('#start-date').data('daterangepicker').startDate.format('YYYY-MM-DDTHH:mm:ss');
    endDate = $('#end-date').data('daterangepicker').endDate.format('YYYY-MM-DDTHH:mm:ss');
    itemId = $('#forecast-key').val();
    responseHistoricalData = null;
    getHistoricalData(startDate, endDate, itemId);
    responseForecast = null;
    getForecast(startDate, endDate, itemId);
    drawChart = setInterval(drawForecast, 1000);
}

function drawForecast() {
    if (responseHistoricalData != null && typeof(responseHistoricalData.data) !== "undefined"
            && responseForecast != null && typeof(responseForecast.Forecast) !== "undefined") {
        clearInterval(drawChart);
        $('#forecast-chart').css('display', 'block');
        var labels = [], historical = [], mean = [], p10 = [], p50 = [], p90 = [], draw_data = [];
        if (responseHistoricalData.data != null) {
            for (i=0; i<responseHistoricalData.data.length; i++) {
                labels.push(moment(responseHistoricalData.data[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                historical.push(responseHistoricalData.data[i].Value);
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
            for (i=0; i<predictions.mean.length; i++) {
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
            for (i=0; i<predictions.p10.length; i++) {
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
            for (i=0; i<predictions.p50.length; i++) {
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
            for (i=0; i<predictions.p90.length; i++) {
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
    } else if ((responseHistoricalData != null && typeof(responseHistoricalData.data) === "undefined")
                || (responseForecast != null && typeof(responseForecast.Forecast) === "undefined")) {
        lineChart = null;
        clearInterval(drawChart);
        $('#modal-loading').modal('hide');
    }
}

function getHistoricalData(startDate, endDate, itemId) {
    finishHistoricalData = null;
	$.ajax({
		url: endpointForecastDemo + '/historicalData',
		type: 'GET',
		contentType: 'application/json',
        dataType: 'json',
        cache: false,
		data: {
        	start_date: startDate + 'Z',
            end_date: endDate + 'Z',
            item_id: itemId
        },
	    success: function(data) {
            console.log(data);
            responseHistoricalData = data;
		},
		error: function(data) {
            console.log(data);
            responseHistoricalData = [];
		}
	});
}


function getForecast(startDate, endDate, itemId) {
    finishForecast = null;
	$.ajax({
		url: endpointForecastDemo + '/queryForecast',
		type: 'GET',
		contentType: 'application/json',
        dataType: 'json',
        cache: false,
		data: {
        	start_date: startDate + 'Z',
            end_date: endDate + 'Z',
            item_id: itemId
        },
	    success: function(data) {
            console.log(data);
            responseForecast = data;
		},
		error: function(data) {
            console.log(data);
            responseForecast = [];
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
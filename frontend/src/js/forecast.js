/*********************************************************************/
/***************************  Forecast  ******************************/
/*********************************************************************/
var endpointForecastDemo = 'http://localhost:3000'
var lineChart = null;

function getForecast() {
    $('#modal-loading').modal('show');
    if (lineChart != null) {
        lineChart.destroy();
    }
    $('#forecast-chart').css('display', 'none');
	startDate = $('#start-date').data('daterangepicker').startDate.format('YYYY-MM-DDTHH:mm:ss');
	endDate = $('#end-date').data('daterangepicker').endDate.format('YYYY-MM-DDTHH:mm:ss');
	$.ajax({
		url: endpointForecastDemo + '/queryForecast',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		data: {
        	start_date: startDate + 'Z',
            end_date: endDate + 'Z',
            item_id: $('#forecast-key').val()
        },
	    success: function(data) {
            console.log(data);
            $('#forecast-chart').css('display', 'block');
            var predictions = data.Forecast.Predictions;
            var labels = [], mean = [], p10 = [], p50 = [], p90 = [];
            var foundLabels = false;
            if (predictions.mean != null) {
                for (i=0; i<predictions.mean.length; i++) {
                    labels.push(moment(predictions.mean[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                    mean.push(predictions.mean[i].Value);
                }
                foundLabels = true;
            }
            if (predictions.p10 != null) {
                for (i=0; i<predictions.p10.length; i++) {
                    if (!foundLabels) {
                        labels.push(moment(predictions.p10[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                    }
                    p10.push(predictions.p10[i].Value);
                }
                foundLabels = true;
            }
            if (predictions.p50 != null) {
                for (i=0; i<predictions.p50.length; i++) {
                    if (labels.length == 0) {
                        labels.push(moment(predictions.p50[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                    }
                    p50.push(predictions.p50[i].Value);
                }
                foundLabels = true;
            }
            if (predictions.p90 != null) {
                for (i=0; i<predictions.p90.length; i++) {
                    if (labels.length == 0) {
                        labels.push(moment(predictions.p90[i].Timestamp).format('YYYY-MM-DD HH:mm'));
                    }
                    p90.push(predictions.p90[i].Value);
                }
                foundLabels = true;
            }
            var ctx = document.getElementById("forecast-chart");
            lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Mean",
                        backgroundColor: "rgba(248, 169, 45, 0)",
                        borderColor: "rgba(248, 169, 45, 0.7)",
                        pointBorderColor: "rgba(248, 169, 45, 0.7)",
                        pointBackgroundColor: "rgba(248, 169, 45, 0.7)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(248, 169, 45, 1)",
                        pointBorderWidth: 1,
                        data: mean
                    }, {
                        label: "P10",
                        backgroundColor: "rgba(0, 255, 0, 0)",
                        borderColor: "rgba(0, 255, 0, 0.70)",
                        pointBorderColor: "rgba(0, 255, 0, 0.70)",
                        pointBackgroundColor: "rgba(0, 255, 0, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(0, 255, 0, 1)",
                        pointBorderWidth: 1,
                        data: p10
                    }, {
                        label: "P50",
                        backgroundColor: "rgba(0, 0, 255, 0)",
                        borderColor: "rgba(0, 0, 255, 0.70)",
                        pointBorderColor: "rgba(0, 0, 255, 0.70)",
                        pointBackgroundColor: "rgba(0, 0, 255, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(0, 0, 255, 1)",
                        pointBorderWidth: 1,
                        data: p50
                    }, {
                        label: "P90",
                        backgroundColor: "rgba(255, 0, 0, 0)",
                        borderColor: "rgba(255, 0, 0, 0.70)",
                        pointBorderColor: "rgba(255, 0, 0, 0.70)",
                        pointBackgroundColor: "rgba(255, 0, 0, 0.70)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(255, 0, 0, 1)",
                        pointBorderWidth: 1,
                        data: p90
                    }]
                },
            });
            $('#modal-loading').modal('hide');
		},
		error: function(data) {
            console.log(data);
            $('#modal-loading').modal('hide');
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
        getForecast();
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
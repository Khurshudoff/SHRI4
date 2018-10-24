import _ from 'lodash';
import './style.sass';
import $ from 'jquery/dist/jquery'

$('#get_time').on('click', (event) => {
	event.preventDefault();

	$.ajax({
		type: "POST",
        url: "/status",
        success: function(data){ 
            $(".time_block_content").text(data);
        },
    });
})

$('.api_event_button').on('click', (event) => {
	$.post('/api/events', 
	{
		type: event.target.innerHTML
	},
	function(data){ 
        $(".api_events_content").text(data);
    })
    .fail(function(err) {
	    $(".api_events_content").text(err.responseText);
	  })
})

$("#form_submit").on('click', (event) =>{
	event.preventDefault();

	const form = $("#events_form");

	const data = {
		eventsOnPage: form.find("input[name='eventsOnPage']").val(),
		numberOfPage: form.find("input[name='numberOfPage']").val(),
		type: form.find("input[name='types']").val()
	}


	$.post('/api/events', data, function(res){ 
        $(".api_events_content").text(res);
    })
    .fail(function(err){
	    $(".api_events_content").text(err.responseText);
    })
})
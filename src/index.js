"use strict";
exports.__esModule = true;
require("./style.sass");
var jquery_1 = require("jquery");
jquery_1["default"]('#get_time').on('click', function (event) {
    event.preventDefault();
    jquery_1["default"].ajax({
        type: "POST",
        url: "/status",
        success: function (data) {
            jquery_1["default"](".time_block_content").text(data);
        }
    });
});
jquery_1["default"]('.api_event_button').on('click', function (event) {
    jquery_1["default"].post('/api/events', {
        type: event.target.innerHTML
    }, function (data) {
        jquery_1["default"](".api_events_content").text(data);
    })
        .fail(function (err) {
        jquery_1["default"](".api_events_content").text(err.responseText);
    });
});
jquery_1["default"]("#form_submit").on('click', function (event) {
    event.preventDefault();
    var form = jquery_1["default"]("#events_form");
    var data = {
        eventsOnPage: form.find("input[name='eventsOnPage']").val(),
        numberOfPage: form.find("input[name='numberOfPage']").val(),
        type: form.find("input[name='types']").val()
    };
    jquery_1["default"].post('/api/events', data, function (res) {
        jquery_1["default"](".api_events_content").text(res);
    })
        .fail(function (err) {
        jquery_1["default"](".api_events_content").text(err.responseText);
    });
});

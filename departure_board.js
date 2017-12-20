
function generateHeader() {
    return $("<tr></tr>").loadTemplate($("#table-header"), null);
}

$(document).ready(function() {

    $.addTemplateFormatter("timeOfDayFormatter", function(val, tmpl) {
        t = moment.unix(val)
        return t.format("h:mm A");
    });
    getDepartures();
    setInterval(getDepartures, 5000);
});

function getDepartures() {
    $.get(
        "http://127.0.0.1:5000/trips",
        
        function(result) {
            $("[id^=departure-table] tr").remove();
            $("[id^=departure-table]").each(function() {
                $(this).append(generateHeader());
            });
            result.forEach(function(el) {
                el.expected = parseInt(el.scheduledtime) + parseInt(el.lateness);
                row = $("<tr></tr>").loadTemplate($("#departure-row-tmpl"), el);
                station = el.origin.replace(" ", "").toLowerCase();
                tid = "#departure-table-" + station;
                if ($(tid).length == 0) {
                    console.log(tid)
                    $("body").append("<div class='station-header'>" + el.origin + "</div>");
                    $("body").append("<table class='departure-table' id='" + tid.substring(1) + "'></table>");
                    $(tid).append(generateHeader());
                }
                $(tid).append(row);
            });
            $("#last-updated").html("updated " + new Date());
        }
    );
}

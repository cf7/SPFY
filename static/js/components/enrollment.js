$(function (event) {

    //thumbnailClickHandler enables each activity thumbnail to act as a button that
    //populates activities table with: 
    // -- activity title
    // -- who is currently enrolled
    // -- columns for.. (tbd)
    var thumbnailClickHandler = function (event) {
        var jThis = $(this);

        $("#activity-title").empty();
        $("#activity-title").append(jThis.text());

        $.ajax({
            xhrFields: {
              withCredentials: true
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
            },
            url: "/api/dropins/" + window.sessionStorage.frontdeskDropinId + "/activities/" + jThis.data("id") + "/enrollment",
            method: "GET",
            success: function (data) {
                console.log("/api/dropins/" + window.sessionStorage.frontdeskDropinId + "/activities/" + jThis.data("id") + "/enrollment");
                console.log(data);
            },
            error: function (data) {
                console.error(data);
            }
        }).done(function (data, textStatus, xhr) {
            $('#activities-table').empty();

            //populate the rows with clients
            $("#activities-table-body").append('<tr><td>'+ data.result.firstName + " " + data.result.lastName +'</td></tr>');
            
        }).fail(function (xhr, textStatus, errorThrown) {

        });
    };

    // .delegate adds event listeners to each element with designated class
    // (in this case, every "td" element)
    // adding a "click" event listener with the function that should execute
    // when the event is detected
    

    $("#create-thumbnail").click(function (event) {
        $('#activities-bar').empty();
        selectedActivities = [];
        $('.activities-add button.active').each(function (index, element) {
            var jThis = $(this);
            selectedActivities.push(jThis.text());
            $('#activities-bar').append('<div class="thumbnail" data-id="' + jThis.data("id") + '" data-program-id="' +
                                        jThis.parent().data('category') + '"><div class="caption"><span class="' +
                                        jThis.parent().data('category') + '"><p>'+ jThis.text() + 
                                        '<button type="button" class="thumbnail-dismiss" aria-label="Close"><span aria-hidden="true">&times;</span></button></p></span></div></div>');
        });

        $(".thumbnail-dismiss").click(function (event) {
            $(this).parent().parent().parent().parent().remove();
        });

        $(".thumbnail").click(thumbnailClickHandler);

    });

    $(".thumbnail-dismiss").click(function (event) {
        $(this).parent().parent().parent().parent().parent().remove();
    });

    $(".thumbnail").click(thumbnailClickHandler);

    //AUTO-

    var selectedclients = [];

    $('#clients').delegate("td", "click", function () {
        var client = $(this)[0].innerText;
        if (!selectedclients.includes(client)) {
            selectedclients.push(client);
        }
        $('#selected-clients').empty();
        for (var i = 0; i < selectedclients.length; i++) {
            $('#selected-clients').append('<li class="list-group-item client">'
                    + selectedclients[i]
                    + '</li>');

        }
    });

    $('#enroll-button').click(function (event) {
        var signups = [];
        var activityids = [];
 
        for (var i = 0; i < allActivities.length; i++) {
            if (selectedActivities.includes(allActivities[i].name)) {
                activityids.push(allActivities[i].id);
            }
        }

        for (var i = 0; i < selectedclients.length; i++) {
            for (var j = 0; j < activityids.length; j++) {
                signups.push({
                    dropinID: currentDropIn.id,
                    clientID: selectedclients[i].match(/[0-9]+/), // TODO: find more effective implementation
                    activityID: activityids[j]
                });
            }
        }

        $.ajax({
            url: "api/enroll",
            method: "POST",
            data: { expression: JSON.stringify(signups) },
            success: function (data) {
                console.log(data);
                var clientString = "";
                for (var i = 0; i < selectedclients.length; i++) {
                    clientString += selectedclients[i] + '<br>';
                }
                var activityString = "";
                for (var i = 0; i < selectedActivities.length; i++) {
                    activityString += selectedActivities[i] + '<br>';
                }

                $('#checkin-enrollment-feedback').empty().append(
                    '<div><h4>Clients Successfully Enrolled</h4>' +
                    '<h4>Clients</h4>' + clientString +
                    '<h4>Activities</h4>' + activityString +
                    '</div>');

                $('#selected-clients').empty();
                $('#selected-activities').empty();
            },
            error: function (data) {
                console.error(data);
                $('#enrollment-feedback').empty().append(
                    '<div><h4>Enrollment failed</h4>');
            }
        });
    });

    //onSearch activities table functionality
    $('#activity-client-search').keyup(function (event) {

        // $("#activities-onSearch-table-body").append('<tr><td>' + ED INSERTS SEARCH STUFF HERE - BUTTON BELOW + '</td>'
        //                                             +'<td><button type="button" class="btn btn-success btn-sm">'
        //                                             +'<i class="fa fa-plus"></i></button></td></tr>');

       $('#enroll').click(function (event) {
        //enroll the selected client into the activity
       });


        if ( !$('#activity-client-search').val()) {
            $("#activities-onSearch-table-body").empty();
        }
    });
        

    

});

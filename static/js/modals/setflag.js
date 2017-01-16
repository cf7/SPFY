$(function () {
    
    var setupSetFlagModal = function () {
        var flagTypes = JSON.parse(window.sessionStorage.flagTypes);

        // TODO 
        // give users ability to customize notifications when setting a flag
        // basically creating the notification after deciding they want to set one
        // option for who will receive the notification

        // default will be to set the notification for the current user
        // but will also have option to set for other users or everyone

        // that said, there should be a panel listing the alerts
        // that are already associated with that particular flag

        

        flagTypes.forEach(function (flagtype, index) {
            console.log(flagtype);
            $('#flag-select').append('<option ' + window.dataString(flagtype) + ' value="' + index + '">' + 
                                        flagtype.name + '</option>');
        });

        // get the settings from the first flag type
        // apply defaults to checkboxes and text inputs
        var firstOption = function () {
            var defaults = $('#flag-select option:selected').data("settings").defaults;
            $('[name="set-message"]').val(defaults.message);
            $('[name="set-note"]').val(defaults.note);
            if (defaults.dot) {
                $('#setflag-modal-dot').prop('checked', true);
            }
        };

        firstOption();

        // get the settings from the currently selected flag type
        // apply defaults to checkboxes and text inputs
        $('#flag-select').change(function (event) {
            var defaults = $('#flag-select option:selected').data("settings").defaults; // .data() auto-converts stringified JSON to an object
            $('[name="set-message"]').val(defaults.message);
            $('[name="set-note"]').val(defaults.note);
            if (defaults.dot) {
                $('#setflag-modal-dot').prop('checked', true);
            } else {
                $('#setflag-modal-dot').prop('checked', false);
            }
        });

        /*
            Files to track for checkin-alert implementation:
            -setflag files
            -editflag files
            -clientprofiletable.js
            -frontdesk.js
        */
        
        $('#setflag-modal-checkin-alert').change(function (event) {
            if ($('#setflag-modal-checkin-alert').is(':checked')) {
                $('#setflag-text-inputs').append('<textarea class="form-control" rows="5" name="set-checkin-alert-message"' + 
                                         'placeholder="Checkin Alert Message"></textarea>');
            } else {
                $('[name="set-checkin-alert-message"]').remove();
            }
        });

        $('#setflag-submit-button').click(function (event) {
            var flagtype = $('#flag-select option:selected');
            var settings = {};

            if ($('#setflag-modal-dot').is(':checked')) {
                settings.dot = true;
            } else {
                settings.dot = false;
            }

            if ($('#setflag-modal-checkin-alert').is(':checked')) {
                settings.checkinalert = $('[name="set-checkin-alert-message"]').val();
            } else {
                settings.checkinalert = false;
            }

            var data = {
                typeID: flagtype.data("id"),
                message: $('[name="set-message"]').val(),
                note: $('[name="set-note"]').val(),
                settings: JSON.stringify(settings)
            };

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
                },
                url: "api/clients/" +  $('#setflag-modal-data').data("clientID") + "/flags",
                method: "POST",
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (xhr) {
                    console.error(xhr);

                    if (xhr.status === 401) {
                        localStorage.removeItem("authorization");
                    }
                }
            }).done(function (data) {
                $('#setflag-modal').modal('toggle');
            });

            // hardcoding this for now
            // var data = {
            //     type: 4,
            //     comment: 'Test notification for set statuses modal',
            //     link: '/index',
            //     checked: 'FALSE'
            // };

            // $.ajax({
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     beforeSend: function (xhr) {
            //         xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
            //     },
            //     url: "api/users/1/notifications", // hardcoding current user for now
            //     method: "POST",
            //     data: data,
            //     success: function (data) {
            //         console.log(data);
            //     },
            //     error: function (xhr) {
            //         console.error(xhr);

            //         if (xhr.status === 401) {
            //             localStorage.removeItem("authorization");
            //         }
            //     }
            // }).done(function (data) {
            //     $('#setstatus-modal').modal('toggle');
            // });
        });
    };

    var globalData = []
    globalData.push(window.sessionStorage.flagTypes);

    if (globalData.every((array) => array)) {
        console.log("call arrived");
        setupSetFlagModal();
    } else {
        console.log("waiting for call");
        window.sessionStorageListeners.push({
            ready: setupSetFlagModal
        });
    }

});
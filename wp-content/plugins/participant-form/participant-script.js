// participant-script.js
jQuery(document).ready(function ($) {
    $("#participant-form").on("submit", function (e) {
        e.preventDefault();

        let formData = {
            action: "participant_send_email", // must match PHP hook
            name: $("#name").val(),
            age: $("#age").val(),
            guardian: $("#guardian").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
        };

        $.post(participantAjax.ajaxurl, formData, function (response) {
            if (response === "success") {
                $("#participant-response").css("color", "green").text("✅ Thank you! Registration successful.");
                $("#participant-form")[0].reset();
            } else if (response === "missing_fields") {
                $("#participant-response").css("color", "red").text("⚠️ Please fill all required fields.");
            } else if (response === "email_failed") {
                $("#participant-response").css("color", "red").text("⚠️ Form saved, but email could not be sent.");
            } else {
                $("#participant-response").css("color", "red").text("⚠️ There was an error. Please try again.");
            }
        });
    });
});

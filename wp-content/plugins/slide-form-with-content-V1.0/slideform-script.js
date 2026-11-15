jQuery(document).ready(function($) {
    const container = $(".slideform-container");
    const fileInput = $("#sf-file");
    const countDisplay = $(".attachment-count");
    const label = $(".attach-label");

    // Open form
    $(".slideform-open-btn").on("click", function() {
        container.addClass("show-form");
    });

    // Cancel button - close form
    $(".cancel-btn").on("click", function() {
        container.removeClass("show-form");
    });

    // Click label opens file input
    label.on("click", function(e) {
        e.preventDefault();
        fileInput.trigger("click");
    });

    // Update counter on file select
    fileInput.on("change", function() {
        const count = this.files.length;
        countDisplay.text(`Attachments (${count})`);
    });

    // Submit form with attachments
    $(document).on("submit", "#slide-contact-form", function(e) {
        e.preventDefault();

        const $resp = $("#slideform-response");
        $resp.text("");

        const formData = new FormData(this);
        formData.append("action", "slideform_send_email");
        formData.append("nonce", slideformAjax.nonce);

        $.ajax({
            url: slideformAjax.ajaxurl,
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res === "success") {
                    $resp.css("color", "green").text("✅ Thank you! Your message was sent.");
                    $("#slide-contact-form")[0].reset();
                    countDisplay.text("Attachments (0)"); // reset counter
                    // Optional: slide back after success
                    // container.removeClass("show-form");
                } else if (res === "invalid_nonce") {
                    $resp.css("color", "red").text("⚠️ Security check failed. Please refresh and try again.");
                } else {
                    $resp.css("color", "red").text("⚠️ Error sending message.");
                }
            },
            error: function() {
                $resp.css("color", "red").text("⚠️ Server error. Please try again.");
            }
        });
    });
});

$(document).ready(function () {
    $('#color').ColorPicker({
        eventName : 'focus',
        color: '#00ff00',
        onChange: function (hsb, hex) {
            $('#color').val('#' + hex);
        },
        onHide: function () {
            var color = $('#color').val();
            // save color to storage
        }
    });

    $("#opacity").slider({
        change: function (event, ui) {
            console.log(event, ui);
        }
    });
});
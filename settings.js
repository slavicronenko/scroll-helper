$(document).ready(function () {
    //getting settings from the storage
    chrome.storage.sync.get(['enabled', 'width', 'style', 'color', 'opacity', 'delay'], function (data) {
        var enabled = data.enabled,
            width = data.width || 2,
            style = data.style || 'solid',
            color = data.color || '#00ff00',
            opacity = data.opacity || 0.5,
            delay = data.delay || 2000;

        // "Enabled" checkbox
        $('#enabled').attr('checked', enabled);

        // Width
        $("#width_val").text(width);
        $("#width").slider({
            min: 1,
            max: 20,
            value: width,
            slide: function (event, ui) {
                $("#width_val").text(ui.value);
                $("#preview").css('border-top-width', ui.value + 'px');
            },
            stop: function (event, ui) {
                chrome.storage.sync.set({'width': ui.value});
            }
        });

        // Style
        $('#style option[value="' + style + '"]').attr('selected', true);

        // Color
        $('#color_val').css('background-color', color);
        $('#color').ColorPicker({
            color: color,
            onHide: function (hsb, hex) {
                $('#color_val').css('background-color', '#' + hex);

                $("#preview").css('border-top-color', '#' + hex);
                chrome.storage.sync.set({'color': '#' + hex});
            },
            onChange: function (hsb, hex) {
                $("#preview").css('border-top-color', '#' + hex);
                $('#color_val').css('background-color', '#' + hex);
            }
        });

        // Opacity
        $('#opacity_val').text(opacity);
        $("#opacity").slider({
            min: 1,
            max: 100,
            value: opacity * 100,
            slide: function (event, ui) {
                $('#opacity_val').text(ui.value / 100);
                $("#preview").css('opacity', ui.value / 100);
            },
            stop: function (event, ui) {
                chrome.storage.sync.set({'opacity': ui.value / 100});
            }
        });

        // Delay
        $('#delay_val').text(delay / 1000);
        $("#delay").slider({
            min: 500,
            max: 5000,
            value: delay,
            slide: function (event, ui) {
                $('#delay_val').text(ui.value / 1000);
            },
            stop: function (event, ui) {
                chrome.storage.sync.set({'delay': ui.value});
            }
        });

        //Preview
        $('#preview').css({
            'border-top-width': width + 'px',
            'border-top-style': style,
            'border-top-color': color,
            'opacity': opacity
        });
    });

    // Saving 'Enabled' option
    $(document).on('change', '#enabled', function () {
        var enabled = $(this).is(':checked');

        chrome.storage.sync.set({'enabled': enabled});
    });

    // Saving 'Style' option
    $(document).on('change', '#style', function () {

        $("#preview").css('border-top-style', this.value);
        chrome.storage.sync.set({'style': this.value});
    });

    // Preventing color change
    $(document).on('change', '#color', function () {
        return false;
    });
});
$(document).ready(function () {
    //getting settings from the storage
    chrome.storage.sync.get(['enabled', 'enable_shortcut', 'width', 'style', 'color', 'opacity', 'delay', 'helper_width', 'margin_left'], function (data) {
        var enabled = data.enabled,
            enable_shortcut = data.enable_shortcut || 69,
            width = data.width || 2,
            style = data.style || 'solid',
            color = (!(data.color === '#undefined' || !data.color)) ? data.color : '#00ff00',
            opacity = data.opacity || 0.5,
            delay = data.delay || 2000,
            helper_width = data.helper_width || 100,
            margin_left = data.margin_left || 0;

        // "Enabled" checkbox
        $('#enabled').attr('checked', enabled);

        // "Enable" shortcut
        $('#enable_shortcut').val(String.fromCharCode(enable_shortcut).toUpperCase());


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

        // Position
        $("#preview").css('width', helper_width + '%');
        $("#preview").css('margin-left', margin_left + '%');
        $("#position").slider({
            range: true,
            min: 0,
            max: 100,
            values: [margin_left, margin_left + helper_width],
            slide: function (event, ui) {
                var helper_width = (100 - ui.values[0]) - (100 - ui.values[1]),
                    margin_left = ui.values[0];

                $("#preview").css('width', helper_width + '%');
                $("#preview").css('margin-left', margin_left + '%');
            },
            stop: function (event, ui) {
                var helper_width = (100 - ui.values[0]) - (100 - ui.values[1]),
                    margin_left = ui.values[0];

                chrome.storage.sync.set({'helper_width': helper_width, 'margin_left': margin_left});
            }
        });

        // Style
        $('#style option[value="' + style + '"]').attr('selected', true);

        // Color
        $('#color_val').css('background-color', color);
        $('#color').ColorPicker({
            color: color,
            onHide: function (hsb) {
                var color = $('#color_val').css('background-color');

                chrome.storage.sync.set({'color': color});
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

        //'Enabled' shortcut events
        $(document).on('blur', '#enable_shortcut', function () {
            var shortcut = $(this).val();

            if (!!shortcut && /^[A-Za-z]$/.test(shortcut)) {
                chrome.storage.sync.set({'enable_shortcut': shortcut.toLowerCase().charCodeAt(0)});
                $('.validation_warnong').remove();
            } else {
                if (!$('.validation_warnong').length) {
                    $('#enable_shortcut').val(String.fromCharCode(enable_shortcut).toUpperCase());
                    $(this).after('<span class="validation_warnong small alert-danger">Please enter a single character!</span>');
                }
            }
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
});
$(document).ready(function () {
    'use strict';
    //getting settings from the storage
    chrome.storage.sync.get(['enabled', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'opacity', 'delay', 'width', 'marginLeft', 'enable_shortcut'], function (data) {
        var enabled = data.enabled,
            enable_shortcut = data.enable_shortcut,
            borderTopWidth = data.borderTopWidth,
            borderTopStyle = data.borderTopStyle,
            borderTopColor = data.borderTopColor,
            opacity = data.opacity,
            delay = data.delay,
            width = data.width,
            marginLeft = data.marginLeft || 0;

        // "Enabled" checkbox
        $('#enabled').attr('checked', enabled);

        // "Enable" shortcut
        $('#enable_shortcut').val(String.fromCharCode(enable_shortcut).toUpperCase());


        // Width
        $("#width_val").text(borderTopWidth);
        $("#width").slider({
            min: 1,
            max: 20,
            value: borderTopWidth,
            slide: function (event, ui) {
                $("#width_val").text(ui.value);
                $("#preview").css('border-top-width', ui.value + 'px');
            },
            stop: function (event, ui) {
                chrome.storage.sync.set({'borderTopWidth': ui.value});
            }
        });

        // Position
        $("#preview").css('width', width + '%');
        $("#preview").css('margin-left', marginLeft + '%');
        $("#position").slider({
            range: true,
            min: 0,
            max: 100,
            values: [marginLeft, marginLeft + width],
            slide: function (event, ui) {
                var h_width = (100 - ui.values[0]) - (100 - ui.values[1]),
                    m_left = ui.values[0];

                $("#preview").css('width', h_width + '%');
                $("#preview").css('margin-left', m_left + '%');
            },
            stop: function (event, ui) {
                var h_width = (100 - ui.values[0]) - (100 - ui.values[1]),
                    m_left = ui.values[0];

                chrome.storage.sync.set({'width': h_width, 'marginLeft': m_left});
            }
        });

        // Style
        $('#style option[value="' + borderTopStyle + '"]').attr('selected', true);

        // Color
        $('#color_val').css('background-color', borderTopColor);
        $('#color').ColorPicker({
            color: borderTopColor,
            onHide: function (hsb) {
                var new_color = $('#color_val').css('background-color');

                chrome.storage.sync.set({'borderTopColor': new_color});
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
            'border-top-width': borderTopWidth + 'px',
            'border-top-style': borderTopStyle,
            'border-top-color': borderTopColor,
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
        chrome.storage.sync.set({'borderTopStyle': this.value});
    });
});
var RONENKO = RONENKO || {};

RONENKO.scroll_helper = (function () {
    'use strict';

    var current_position = document.body.scrollTop,

        timer = null,

        option,

        tmp_margin,

        tmp_position,

// default settings
        delay = 2000,

        settings = {
            position: 'absolute',
            width: document.body.clientWidth + 'px',
            height: '0px',
            zIndex: '99999999',
            borderTopColor: '#00ff00',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            opacity: 0.5
        },

        div = document.createElement('div'),

// public methods
        setColor = function (color) {
            if (typeof color === 'string') {
                div.style.borderTopColor = color;
            } else {
                throw new Error('You should pass a correct color (eg. "#369" or "#00ffcc"). Value given - "' + color + '"');
            }
        },

        setOpacity = function (opacity) {
            if (opacity > 0 && opacity <= 1) {
                div.style.opacity = opacity;
            } else {
                throw new Error('You should pass a number from 0 to 1 (default is 0.5). Value given - "' + opacity + '"');
            }
        },

        setWidth = function (width) {
            if (width >= 1 && width <= 20) {
                div.style.borderTopWidth = width + 'px';
            } else {
                throw new Error('You should pass a number from 1 to 20. Value given - "' + width + '"');
            }
        },

        setStyle = function (style) {
            if ((['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge']).indexOf(style) !== -1) {
                div.style.borderTopStyle = style;
            } else {
                throw new Error('You should pass one of this: dotted, dashed, solid, double, groove, ridge. Value given - "' + style + '"');
            }
        },

        setSettings = function (settings) {
            if (typeof settings === 'object' && !!settings) {
                if (!!settings.width) {
                    setWidth(settings.width);
                }
                if (!!settings.style) {
                    setStyle(settings.style);
                }
                if (!!settings.color) {
                    setColor(settings.color);
                }
                if (!!settings.opacity) {
                    setOpacity(settings.opacity);
                }
            } else {
                throw new Error('You should pass object with settings (width, style, color, opacity).');
            }
        };

//applying style settings to div
    for (option in settings) {
        if (settings.hasOwnProperty(option)) {
            div.style[option] = settings[option];
        }
    }

    window.addEventListener('scroll', function () {
        chrome.storage.sync.get(['enabled', 'width', 'style', 'color', 'opacity', 'delay'], function (data) {
            var enabled = data.enabled,
                width = data.width || settings.width,
                style = data.style || settings.borderTopStyle,
                color = data.color || '00ff00',
                opacity = data.opacity || settings.opacity;

            delay = data.delay || delay;

            if (enabled) {
                tmp_position = document.body.scrollTop;

                setSettings({
                    width: width,
                    style: style,
                    color: '#' + color,
                    opacity: opacity
                });

                if (!timer) {
                    tmp_margin = (current_position < tmp_position) ? window.innerHeight : 0;

                    div.style.top = current_position + tmp_margin + 'px';
                    document.body.appendChild(div);
                } else {
                    window.clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    window.clearTimeout(timer);
                    timer = null;
                    div.parentElement.removeChild(div);
                }, delay);

                current_position = tmp_position;
            }
        });
    });

    /*window.addEventListener('keydown', function (e) {
        console.log(228);
    });*/

    return {
        element: div,
        setColor: setColor,
        setOpacity: setOpacity,
        setWidth: setWidth,
        setStyle: setStyle,
        setSettings: setSettings
    };
}());
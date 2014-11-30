var RONENKO = RONENKO || {};
chrome.storage.sync.clear();
RONENKO.scroll_helper = (function () {
    'use strict';

    var current_position = document.body.scrollTop,

        timer = null,

        tmp_margin,

        tmp_position,

// default settings
        delay = 2000,

        settings = {
            position: 'absolute',
            width: '100',
            height: '0px',
            zIndex: '99999999',
            borderTopColor: '#00ff00',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            marginLeft: '0',
            opacity: 0.5
        },

        lshift_down = false,

        div = document.createElement('div'),

// public methods
        setCssStyle = function (props) {
            var option;
            if (typeof props === 'object') {
                for (option in props) {
                    if (props.hasOwnProperty(option)) {
                        div.style[option] = props[option];
                    }
                }
            } else {
                throw new Error('You should pass an object with properties.');
            }
        },

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

        setMargin = function (margin) {
            if (margin >= 0 && margin <= 100) {
                div.style.marginLeft = margin + '%';
            } else {
                throw new Error('You should pass a number from 0 to 100. Value given - "' + margin + '"');
            }
        },

        setHelperWidth = function (width) {
            if (width >= 0 && width <= 100) {
                div.style.width = width + '%';
            } else {
                throw new Error('You should pass a number from 0 to 100. Value given - "' + width + '"');
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
                if (settings.margin_left !== undefined) {
                    setMargin(settings.margin_left);
                }
                if (!!settings.helper_width) {
                    setHelperWidth(settings.helper_width);
                }
            } else {
                throw new Error('You should pass object with settings (width, style, color, opacity).');
            }
        };

//applying style settings to div
    setCssStyle(settings);

    window.addEventListener('scroll', function () {
        chrome.storage.sync.get(['enabled', 'width', 'style', 'color', 'opacity', 'delay', 'helper_width', 'margin_left'], function (data) {
            var enabled = data.enabled,
                width = data.width || settings.borderTopWidth,
                style = data.style || settings.borderTopStyle,
                color = data.color || settings.borderTopColor,
                opacity = data.opacity || settings.opacity,
                helper_width = data.helper_width || settings.width,
                margin_left = data.margin_left || 0;

            width = width.replace('px', '');
            delay = data.delay || delay;

            if (enabled) {
                tmp_position = document.body.scrollTop;

                setSettings({
                    width: width,
                    style: style,
                    color: color,
                    opacity: opacity,
                    margin_left: margin_left,
                    helper_width: helper_width
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

    window.addEventListener('keydown', function (e) {
        chrome.storage.sync.get(['enable_shortcut'], function (data) {
            var enable_shortcut = data.enable_shortcut || 69,
                key;

            if (!!enable_shortcut) {
                key = String.fromCharCode(e.which).toLowerCase().charCodeAt(0);

                if (e.which === 16) {
                    lshift_down = true;
                } else if (key === enable_shortcut) {
                    if (lshift_down) {
                        chrome.storage.sync.get(['enabled'], function (data) {

                            chrome.storage.sync.set({'enabled': !data.enabled});
                        });
                    }
                }
            }
        });
    });

    window.addEventListener('keyup', function (e) {
        if (e.which === 16) {
            lshift_down = false;
        }
    });

    return {
        element: div,
        setColor: setColor,
        setOpacity: setOpacity,
        setWidth: setWidth,
        setStyle: setStyle,
        setMargin: setMargin,
        setHelperWidth: setHelperWidth,
        setSettings: setSettings
    };
}());
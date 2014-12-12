var RONENKO = RONENKO || {};
RONENKO.scroll_helper = (function () {
    'use strict';

    var current_position = document.body.scrollTop,
        timer = null,
        tmp_margin,
        tmp_position,
        lshift_down = false,
        div = document.createElement('div'),
        default_style = {
            position: 'absolute',
            width: '100%',
            height: '0px',
            zIndex: '999999999999999',
            borderTopColor: '#00ff00',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            marginLeft: '0%',
            opacity: 0.5
        };

    //Setting the default parameters
    chrome.storage.sync.get(['enabled', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'opacity', 'delay', 'width', 'marginLeft', 'enable_shortcut'], function (parameters) {
        var default_parameters = {
                'enabled': true,
                'borderTopWidth': default_style.borderTopWidth.replace('px', ''),
                'borderTopStyle': default_style.borderTopStyle,
                'borderTopColor': default_style.borderTopColor,
                'opacity': default_style.opacity,
                'delay': 3000,
                'width': default_style.width.replace('%', ''),
                'marginLeft': default_style.marginLeft.replace('%', ''),
                'enable_shortcut': 101
            },
            i,
            changed = false;

        for (i in default_parameters) {
            if (parameters[i] === undefined) {
                parameters[i] = default_parameters[i];
                changed = true;
            }
        }

        if (changed) {
            chrome.storage.sync.set(parameters);
        }
    });

    function setCssStyle(props) {
        var option;
        if (typeof props === 'object') {
            for (option in props) {
                if (props.hasOwnProperty(option)) {
                    div.style[option] = props[option];
                }
            }
        } else {
            throw new Error('You should pass an object with style properties.');
        }
    };

    setCssStyle(default_style);

    window.addEventListener('scroll', function () {
        chrome.storage.sync.get(['enabled', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'opacity', 'delay', 'width', 'marginLeft'], function (data) {
            if (data.enabled) {
                tmp_position = document.body.scrollTop;

                setCssStyle({
                    borderTopWidth: data.borderTopWidth + 'px',
                    borderTopStyle: data.borderTopStyle,
                    borderTopColor: data.borderTopColor,
                    opacity: data.opacity,
                    marginLeft: data.marginLeft + '%',
                    width: data.width + '%'
                });

                if (!timer) {
                    tmp_margin = (current_position < tmp_position) ? window.innerHeight - data.borderTopWidth : 0;

                    div.style.top = current_position + tmp_margin + 'px';
                    document.body.appendChild(div);
                } else {
                    window.clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    window.clearTimeout(timer);
                    timer = null;
                    div.parentElement.removeChild(div);
                }, data.delay);

                current_position = tmp_position;
            }
        });
    });

    window.addEventListener('keydown', function (e) {
        chrome.storage.sync.get(['enable_shortcut'], function (data) {
            var key;

            if (!!data.enable_shortcut) {
                key = String.fromCharCode(e.which).toLowerCase().charCodeAt(0);

                if (e.which === 16) {
                    lshift_down = true;
                } else if (key === data.enable_shortcut) {
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
}());
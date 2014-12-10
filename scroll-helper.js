var RONENKO = RONENKO || {};
//chrome.storage.sync.clear();
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
            width: '100',
            height: '0px',
            zIndex: '999999999999999',
            borderTopColor: '#00ff00',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            marginLeft: '0',
            opacity: 0.5
        };

    //Setting the default parameters
    chrome.storage.sync.get(['enabled', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'opacity', 'delay', 'width', 'marginLeft'], function (parameters) {
        var default_parameters = {
                'enabled': true,
                'borderTopWidth': 1,
                'borderTopStyle': 'solid',
                'borderTopColor': '#00ff00',
                'opacity': 0.5,
                'delay': 30000,
                'width': 100,
                'marginLeft': 0
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
            throw new Error('You should pass an object with properties.');
        }
    }

    (default_style);

    window.addEventListener('scroll', function () {
        chrome.storage.sync.get(['enabled', 'borderTopWidth', 'borderTopStyle', 'color', 'opacity', 'delay', 'helper_width', 'marginLeft'], function (data) {
            if (data.enabled) {
                tmp_position = document.body.scrollTop;

                setCssStyle({
                    borderTopWidth: data.width + 'px',
                    borderTopStyle: data.style,
                    borderTopColor: data.color,
                    opacity: data.opacity,
                    marginLeft: data.marginLeft + '%',
                    width: data.helper_width + '%'
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
                }, data.delay);

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
}());
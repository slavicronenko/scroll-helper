var RONENKO = RONENKO || {};

RONENKO.scroll_helper =  (function () {
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
            borderTopColor: '#0f0',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            opacity: 0.5
        },

        div = document.createElement('div'),

// public methods
        setColor = function(color) {
            if(typeof color === 'string') {
                div.style.borderTopColor = color;
            } else {
                throw new Error('You should pass a correct color (eg. "#369" or "#00ffcc").');
            }
        },
        
        setOpacity = function(opacity) {
            if(opacity > 0 && opacity <= 1) {
                div.style.opacity = opacity;
            } else {
                throw new Error('You should pass a number from 0 to 1 (default is 0.5).');
            }
        },

        setWidth = function(width) {
            if(width >= 1 && width <= 10) {
                div.style.borderTopWidth = width + 'px';
            } else {
				throw new Error('You should pass a number from 1 to 10');
            }
        },
        
        setStyle = function(style) {
            if((['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge']).indexOf(style) != -1) {
                div.style.borderTopStyle = style;
            } else {
                throw new Error('You should pass one of this: dotted, dashed, solid, double, groove, ridge ');
            }
        };

//applying style settings to div
    for (option in settings) {
        if (settings.hasOwnProperty(option)) {
            div.style[option] = settings[option];
        }
    }

    window.addEventListener('scroll', function () {

        tmp_position = document.body.scrollTop;

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
    });
    
    return {
        element :   div,
        setColor : setColor,
        setOpacity : setOpacity,
        setWidth : setWidth,
        setStyle : setStyle
    };
}());
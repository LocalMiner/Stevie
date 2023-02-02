(function () {
    var on = addEventListener,
        $ = function (q) {
            return document.querySelector(q)
        },
        $$ = function (q) {
            return document.querySelectorAll(q)
        },
        $body = document.body,
        $inner = $('.inner'),
        client = (function () {
            var o = {
                    browser: 'other',
                    browserVersion: 0,
                    os: 'other',
                    osVersion: 0,
                    mobile: false,
                    canUse: null,
                    flags: {
                        lsdUnits: false,
                    },
                },
                ua = navigator.userAgent,
                a, i;
            a = [
                ['firefox', /Firefox\/([0-9\.]+)/],
                ['edge', /Edge\/([0-9\.]+)/],
                ['safari', /Version\/([0-9\.]+).+Safari/],
                ['chrome', /Chrome\/([0-9\.]+)/],
                ['chrome', /CriOS\/([0-9\.]+)/],
                ['ie', /Trident\/.+rv:([0-9]+)/]
            ];
            for (i = 0; i < a.length; i++) {
                if (ua.match(a[i][1])) {
                    o.browser = a[i][0];
                    o.browserVersion = parseFloat(RegExp.$1);
                    break;
                }
            }
            a = [
                ['ios', /([0-9_]+) like Mac OS X/, function (v) {
                    return v.replace('_', '.').replace('_', '');
                }],
                ['ios', /CPU like Mac OS X/, function (v) {
                    return 0
                }],
                ['ios', /iPad; CPU/, function (v) {
                    return 0
                }],
                ['android', /Android ([0-9\.]+)/, null],
                ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function (v) {
                    return v.replace('_', '.').replace('_', '');
                }],
                ['windows', /Windows NT ([0-9\.]+)/, null],
                ['undefined', /Undefined/, null],
            ];
            for (i = 0; i < a.length; i++) {
                if (ua.match(a[i][1])) {
                    o.os = a[i][0];
                    o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
                    break;
                }
            }
            if (o.os == 'mac' && ('ontouchstart' in window) && ((screen.width == 1024 && screen
                    .height == 1366) || (screen.width == 834 && screen.height == 1112) || (screen
                    .width == 810 && screen.height == 1080) || (screen.width == 768 && screen
                    .height == 1024))) o.os = 'ios';
            o.mobile = (o.os == 'android' || o.os == 'ios');
            var _canUse = document.createElement('div');
            o.canUse = function (property, value) {
                var style;
                style = _canUse.style;
                if (!(property in style)) return false;
                if (typeof value !== 'undefined') {
                    style[property] = value;
                    if (style[property] == '') return false;
                }
                return true;
            };
            o.flags.lsdUnits = o.canUse('width', '100dvw');
            return o;
        }()),
        trigger = function (t) {
            dispatchEvent(new Event(t));
        },
        cssRules = function (selectorText) {
            var ss = document.styleSheets,
                a = [],
                f = function (s) {
                    var r = s.cssRules,
                        i;
                    for (i = 0; i < r.length; i++) {
                        if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)(f)(r[
                            i]);
                        else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText) a.push(
                            r[i]);
                    }
                },
                x, i;
            for (i = 0; i < ss.length; i++) f(ss[i]);
            return a;
        },
        thisHash = function () {
            var h = location.hash ? location.hash.substring(1) : null,
                a;
            if (!h) return null;
            if (h.match(/\?/)) {
                a = h.split('?');
                h = a[0];
                history.replaceState(undefined, undefined, '#' + h);
                window.location.search = a[1];
            }
            if (h.length > 0 && !h.match(/^[a-zA-Z]/)) h = 'x' + h;
            if (typeof h == 'string') h = h.toLowerCase();
            return h;
        },
        scrollToElement = function (e, style, duration) {
            var y, cy, dy, start, easing, offset, f;
            if (!e) y = 0;
            else {
                offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(
                    getComputedStyle(document.documentElement).fontSize);
                switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
                    case 'default':
                    default:
                        y = e.offsetTop + offset;
                        break;
                    case 'center':
                        if (e.offsetHeight < window.innerHeight) y = e.offsetTop - ((window.innerHeight - e
                            .offsetHeight) / 2) + offset;
                        else y = e.offsetTop - offset;
                        break;
                    case 'previous':
                        if (e.previousElementSibling) y = e.previousElementSibling.offsetTop + e
                            .previousElementSibling.offsetHeight + offset;
                        else y = e.offsetTop + offset;
                        break;
                }
            }
            if (!style) style = 'smooth';
            if (!duration) duration = 750;
            if (style == 'instant') {
                window.scrollTo(0, y);
                return;
            }
            start = Date.now();
            cy = window.scrollY;
            dy = y - cy;
            switch (style) {
                case 'linear':
                    easing = function (t) {
                        return t
                    };
                    break;
                case 'smooth':
                    easing = function (t) {
                        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
                    };
                    break;
            }
            f = function () {
                var t = Date.now() - start;
                if (t >= duration) window.scroll(0, y);
                else {
                    window.scroll(0, cy + (dy * easing(t / duration)));
                    requestAnimationFrame(f);
                }
            };
            f();
        },
        scrollToTop = function () {
            scrollToElement(null);
        },
        loadElements = function (parent) {
            var a, e, x, i;
            a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
            for (i = 0; i < a.length; i++) {
                a[i].contentWindow.location.replace(a[i].dataset.src);
                a[i].dataset.initialSrc = a[i].dataset.src;
                a[i].dataset.src = '';
            }
            a = parent.querySelectorAll('video[autoplay]');
            for (i = 0; i < a.length; i++) {
                if (a[i].paused) a[i].play();
            }
            e = parent.querySelector('[data-autofocus="1"]');
            x = e ? e.tagName : null;
            switch (x) {
                case 'FORM':
                    e = e.querySelector('.field input, .field select, .field textarea');
                    if (e) e.focus();
                    break;
                default:
                    break;
            }
        },
        unloadElements = function (parent) {
            var a, e, x, i;
            a = parent.querySelectorAll('iframe[data-src=""]');
            for (i = 0; i < a.length; i++) {
                if (a[i].dataset.srcUnload === '0') continue;
                if ('initialSrc' in a[i].dataset) a[i].dataset.src = a[i].dataset.initialSrc;
                else a[i].dataset.src = a[i].src;
                a[i].contentWindow.location.replace('about:blank');
            }
            a = parent.querySelectorAll('video');
            for (i = 0; i < a.length; i++) {
                if (!a[i].paused) a[i].pause();
            }
            e = $(':focus');
            if (e) e.blur();
        };
    window._scrollToTop = scrollToTop;
    var thisURL = function () {
        return window.location.href.replace(window.location.search, '').replace(/#$/, '');
    };
    var getVar = function (name) {
        var a = window.location.search.substring(1).split('&'),
            b, k;
        for (k in a) {
            b = a[k].split('=');
            if (b[0] == name) return b[1];
        }
        return null;
    };
    var errors = {
        handle: function (handler) {
            window.onerror = function (message, url, line, column, error) {
                (handler)(error.message);
                return true;
            };
        },
        unhandle: function () {
            window.onerror = null;
        }
    };
    var db = {
        open: function (objectStoreName, handler) {
            var request = indexedDB.open('carrd');
            request.onupgradeneeded = function (event) {
                event.target.result.createObjectStore(objectStoreName, {
                    keyPath: 'id'
                });
            };
            request.onsuccess = function (event) {
                (handler)(event.target.result.transaction([objectStoreName], 'readwrite')
                    .objectStore(objectStoreName));
            };
        },
        put: function (objectStore, values, handler) {
            var request = objectStore.put(values);
            request.onsuccess = function (event) {
                (handler)();
            };
            request.onerror = function (event) {
                throw new Error('db.put: error');
            };
        },
        get: function (objectStore, id, handler) {
            var request = objectStore.get(id);
            request.onsuccess = function (event) {
                if (!event.target.result) throw new Error(
                    'db.get: could not retrieve object with id "' + id + '"');
                (handler)(event.target.result);
            };
            request.onerror = function (event) {
                throw new Error('db.get: error');
            };
        },
        delete: function (objectStore, id, handler) {
            objectStore.delete(id).onsuccess = function (event) {
                (handler)(event.target.result);
            };
        },
    };
    on('load', function () {
        setTimeout(function () {
            $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
            setTimeout(function () {
                $body.className = $body.className.replace(/\bis-playing\b/,
                    'is-ready');
            }, 500);
        }, 100);
    });
    loadElements(document.body);
    (function () {
        var scrollPointParent = function (target) {
                var inner, target;
                inner = $('#main > .inner');
                target = event.target;
                while (target && target.parentElement != inner) target = target.parentElement;
                return target;
            },
            doNextScrollPoint = function (event) {
                var e, target, id;
                event.preventDefault();
                event.stopPropagation();
                e = scrollPointParent(event.target);
                if (!e) return;
                while (e && e.nextElementSibling) {
                    e = e.nextElementSibling;
                    if (e.dataset.scrollId) {
                        target = e;
                        id = e.dataset.scrollId;
                        break;
                    }
                }
                if (!target || !id) return;
                if (target.dataset.scrollInvisible == '1') scrollToElement(target);
                else location.href = '#' + id;
            },
            doPreviousScrollPoint = function (e) {
                var e, target, id;
                event.preventDefault();
                event.stopPropagation();
                e = scrollPointParent(event.target);
                if (!e) return;
                while (e && e.previousElementSibling) {
                    e = e.previousElementSibling;
                    if (e.dataset.scrollId) {
                        target = e;
                        id = e.dataset.scrollId;
                        break;
                    }
                }
                if (!target || !id) return;
                if (target.dataset.scrollInvisible == '1') scrollToElement(target);
                else location.href = '#' + id;
            },
            doFirstScrollPoint = function (e) {
                var e, target, id;
                event.preventDefault();
                event.stopPropagation();
                e = scrollPointParent(event.target);
                if (!e) return;
                while (e && e.previousElementSibling) {
                    e = e.previousElementSibling;
                    if (e.dataset.scrollId) {
                        target = e;
                        id = e.dataset.scrollId;
                    }
                }
                if (!target || !id) return;
                if (target.dataset.scrollInvisible == '1') scrollToElement(target);
                else location.href = '#' + id;
            },
            doLastScrollPoint = function (e) {
                var e, target, id;
                event.preventDefault();
                event.stopPropagation();
                e = scrollPointParent(event.target);
                if (!e) return;
                while (e && e.nextElementSibling) {
                    e = e.nextElementSibling;
                    if (e.dataset.scrollId) {
                        target = e;
                        id = e.dataset.scrollId;
                    }
                }
                if (!target || !id) return;
                if (target.dataset.scrollInvisible == '1') scrollToElement(target);
                else location.href = '#' + id;
            };
        window._nextScrollPoint = doNextScrollPoint;
        window._previousScrollPoint = doPreviousScrollPoint;
        window._firstScrollPoint = doFirstScrollPoint;
        window._lastScrollPoint = doLastScrollPoint;
        window._scrollToTop = function () {
            scrollToElement(null);
            if (window.location.hash) {
                history.pushState(null, null, '.');
            }
        };
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        on('load', function () {
            var initialScrollPoint, h;
            h = thisHash();
            if (h && !h.match(/^[a-zA-Z0-9\-]+$/)) h = null;
            initialScrollPoint = $('[data-scroll-id="' + h + '"]');
            if (initialScrollPoint) scrollToElement(initialScrollPoint, 'instant');
        });
        on('hashchange', function (event) {
            var scrollPoint, h, pos;
            h = thisHash();
            if (h && !h.match(/^[a-zA-Z0-9\-]+$/)) return false;
            scrollPoint = $('[data-scroll-id="' + h + '"]');
            if (scrollPoint) scrollToElement(scrollPoint);
            else scrollToElement(null);
            return false;
        });
        on('click', function (event) {
            var t = event.target,
                tagName = t.tagName.toUpperCase(),
                scrollPoint;
            switch (tagName) {
                case 'IMG':
                case 'SVG':
                case 'USE':
                case 'U':
                case 'STRONG':
                case 'EM':
                case 'CODE':
                case 'S':
                case 'MARK':
                case 'SPAN':
                    while (!!(t = t.parentElement))
                        if (t.tagName == 'A') break;
                    if (!t) return;
                    break;
                default:
                    break;
            }
            if (t.tagName == 'A' && t.getAttribute('href').substr(0, 1) == '#') {
                if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) +
                        '"][data-scroll-invisible="1"]'))) {
                    event.preventDefault();
                    scrollToElement(scrollPoint);
                } else if (t.hash == window.location.hash) {
                    event.preventDefault();
                    history.replaceState(undefined, undefined, '#');
                    location.replace(t.hash);
                }
            }
        });
    })();
    var style, sheet, rule;
    style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    sheet = style.sheet;
    if (client.mobile) {
        (function () {
            if (client.flags.lsdUnits) {
                document.documentElement.style.setProperty('--viewport-height', '100svh');
                document.documentElement.style.setProperty('--background-height', '100dvh');
            } else {
                var f = function () {
                    document.documentElement.style.setProperty('--viewport-height', window
                        .innerHeight + 'px');
                    document.documentElement.style.setProperty('--background-height', (window
                        .innerHeight + 250) + 'px');
                };
                on('load', f);
                on('orientationchange', function () {
                    setTimeout(function () {
                        (f)();
                    }, 100);
                });
            }
        })();
    }
    if (client.os == 'android') {
        (function () {
            sheet.insertRule('body::after { }', 0);
            rule = sheet.cssRules[0];
            var f = function () {
                rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
            };
            on('load', f);
            on('orientationchange', f);
            on('touchmove', f);
        })();
        $body.classList.add('is-touch');
    } else if (client.os == 'ios') {
        if (client.osVersion <= 11)(function () {
            sheet.insertRule('body::after { }', 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = '-webkit-transform: scale(1.0)';
        })();
        if (client.osVersion <= 11)(function () {
            sheet.insertRule('body.ios-focus-fix::before { }', 0);
            rule = sheet.cssRules[0];
            rule.style.cssText = 'height: calc(100% + 60px)';
            on('focus', function (event) {
                $body.classList.add('ios-focus-fix');
            }, true);
            on('blur', function (event) {
                $body.classList.remove('ios-focus-fix');
            }, true);
        })();
        $body.classList.add('is-touch');
    }
    var scrollEvents = {
        items: [],
        add: function (o) {
            this.items.push({
                element: o.element,
                triggerElement: (('triggerElement' in o && o.triggerElement) ? o
                    .triggerElement : o.element),
                enter: ('enter' in o ? o.enter : null),
                leave: ('leave' in o ? o.leave : null),
                mode: ('mode' in o ? o.mode : 3),
                offset: ('offset' in o ? o.offset : 0),
                initialState: ('initialState' in o ? o.initialState : null),
                state: false,
            });
        },
        handler: function () {
            var height, top, bottom, scrollPad;
            if (client.os == 'ios') {
                height = document.documentElement.clientHeight;
                top = document.body.scrollTop + window.scrollY;
                bottom = top + height;
                scrollPad = 125;
            } else {
                height = document.documentElement.clientHeight;
                top = document.documentElement.scrollTop;
                bottom = top + height;
                scrollPad = 0;
            }
            scrollEvents.items.forEach(function (item) {
                var bcr, elementTop, elementBottom, state, a, b;
                if (!item.enter && !item.leave) return true;
                if (!item.triggerElement || item.triggerElement.offsetParent === null)
                    return true;
                bcr = item.triggerElement.getBoundingClientRect();
                elementTop = top + Math.floor(bcr.top);
                elementBottom = elementTop + bcr.height;
                if (item.initialState !== null) {
                    state = item.initialState;
                    item.initialState = null;
                } else {
                    switch (item.mode) {
                        case 1:
                        default:
                            state = (bottom > (elementTop - item.offset) && top < (
                                elementBottom + item.offset));
                            break;
                        case 2:
                            a = (top + (height * 0.5));
                            state = (a > (elementTop - item.offset) && a < (elementBottom +
                                item.offset));
                            break;
                        case 3:
                            a = top + (height * 0.25);
                            if (a - (height * 0.375) <= 0) a = 0;
                            b = top + (height * 0.75);
                            if (b + (height * 0.375) >= document.body.scrollHeight -
                                scrollPad) b = document.body.scrollHeight + scrollPad;
                            state = (b > (elementTop - item.offset) && a < (elementBottom +
                                item.offset));
                            break;
                    }
                }
                if (state != item.state) {
                    item.state = state;
                    if (item.state) {
                        if (item.enter) {
                            (item.enter).apply(item.element);
                            if (!item.leave) item.enter = null;
                        }
                    } else {
                        if (item.leave) {
                            (item.leave).apply(item.element);
                            if (!item.enter) item.leave = null;
                        }
                    }
                }
            });
        },
        init: function () {
            on('load', this.handler);
            on('resize', this.handler);
            on('scroll', this.handler);
            (this.handler)();
        }
    };
    scrollEvents.init();
    var onvisible = {
        effects: {
            'blur-in': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.opacity = 0;
                    this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.filter = 'none';
                },
            },
            'zoom-in': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'zoom-out': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'slide-left': {
                transition: function (speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function () {
                    this.style.transform = 'translateX(100vw)';
                },
                play: function () {
                    this.style.transform = 'none';
                },
            },
            'slide-right': {
                transition: function (speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function () {
                    this.style.transform = 'translateX(-100vw)';
                },
                play: function () {
                    this.style.transform = 'none';
                },
            },
            'flip-forward': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) *
                        intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-backward': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) *
                        intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-left': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) *
                        intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'flip-right': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transformOrigin = '50% 50%';
                    this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) *
                        intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'tilt-left': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'tilt-right': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity, alt) {
                    this.style.opacity = 0;
                    this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-right': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-left': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-down': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-up': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
                        'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.opacity = 0;
                    this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
                },
                play: function () {
                    this.style.opacity = 1;
                    this.style.transform = 'none';
                },
            },
            'fade-in': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function () {
                    this.style.opacity = 0;
                },
                play: function () {
                    this.style.opacity = 1;
                },
            },
            'fade-in-background': {
                custom: true,
                transition: function (speed, delay) {
                    this.style.setProperty('--onvisible-speed', speed + 's');
                    if (delay) this.style.setProperty('--onvisible-delay', delay + 's');
                },
                rewind: function () {
                    this.style.removeProperty('--onvisible-background-color');
                },
                play: function () {
                    this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
                },
            },
            'zoom-in-image': {
                target: 'img',
                transition: function (speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function () {
                    this.style.transform = 'scale(1)';
                },
                play: function (intensity) {
                    this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
                },
            },
            'zoom-out-image': {
                target: 'img',
                transition: function (speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
                },
                play: function () {
                    this.style.transform = 'none';
                },
            },
            'focus-image': {
                target: 'img',
                transition: function (speed, delay) {
                    return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') +
                        ', ' + 'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                },
                rewind: function (intensity) {
                    this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
                    this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
                },
                play: function (intensity) {
                    this.style.transform = 'none';
                    this.style.filter = 'none';
                },
            },
        },
        add: function (selector, settings) {
            var style = settings.style in this.effects ? settings.style : 'fade',
                speed = parseInt('speed' in settings ? settings.speed : 1000) / 1000,
                intensity = ((parseInt('intensity' in settings ? settings.intensity : 5) / 10) *
                    1.75) + 0.25,
                delay = parseInt('delay' in settings ? settings.delay : 0) / 1000,
                replay = 'replay' in settings ? settings.replay : false,
                stagger = 'stagger' in settings ? (parseInt(settings.stagger) > -125 ? (parseInt(
                    settings.stagger) / 1000) : false) : false,
                staggerOrder = 'staggerOrder' in settings ? settings.staggerOrder : 'default',
                state = 'state' in settings ? settings.state : null,
                effect = this.effects[style];
            if ('CARRD_DISABLE_ANIMATION' in window) {
                if (style == 'fade-in-background') $$(selector).forEach(function (e) {
                    e.style.setProperty('--onvisible-background-color',
                        'rgba(0,0,0,0.001)');
                });
                return;
            }
            $$(selector).forEach(function (e) {
                var children = (stagger !== false) ? e.querySelectorAll(
                        ':scope > li, :scope ul > li') : null,
                    enter = function (staggerDelay = 0) {
                        var _this = this,
                            transitionOrig;
                        if (effect.target) _this = this.querySelector(effect.target);
                        if (!effect.custom) {
                            transitionOrig = _this.style.transition;
                            _this.style.setProperty('backface-visibility', 'hidden');
                            _this.style.transition = effect.transition(speed, delay +
                                staggerDelay);
                        } else effect.transition.apply(_this, [speed, delay +
                            staggerDelay
                        ]);
                        effect.play.apply(_this, [intensity, !!children]);
                        if (!effect.custom) setTimeout(function () {
                            _this.style.removeProperty('backface-visibility');
                            _this.style.transition = transitionOrig;
                        }, (speed + delay + staggerDelay) * 1000 * 2);
                    },
                    leave = function () {
                        var _this = this,
                            transitionOrig;
                        if (effect.target) _this = this.querySelector(effect.target);
                        if (!effect.custom) {
                            transitionOrig = _this.style.transition;
                            _this.style.setProperty('backface-visibility', 'hidden');
                            _this.style.transition = effect.transition(speed);
                        } else effect.transition.apply(_this, [speed]);
                        effect.rewind.apply(_this, [intensity, !!children]);
                        if (!effect.custom) setTimeout(function () {
                            _this.style.removeProperty('backface-visibility');
                            _this.style.transition = transitionOrig;
                        }, speed * 1000 * 2);
                    },
                    targetElement, triggerElement;
                if (effect.target) targetElement = e.querySelector(effect.target);
                else targetElement = e;
                if (children) children.forEach(function (targetElement) {
                    effect.rewind.apply(targetElement, [intensity, true]);
                });
                else effect.rewind.apply(targetElement, [intensity]);
                triggerElement = e;
                if (e.parentNode) {
                    if (e.parentNode.dataset.onvisibleTrigger) triggerElement = e
                        .parentNode;
                    else if (e.parentNode.parentNode) {
                        if (e.parentNode.parentNode.dataset.onvisibleTrigger)
                            triggerElement = e.parentNode.parentNode;
                    }
                }
                scrollEvents.add({
                    element: e,
                    triggerElement: triggerElement,
                    initialState: state,
                    enter: children ? function () {
                        var staggerDelay = 0,
                            childHandler = function (e) {
                                enter.apply(e, [staggerDelay]);
                                staggerDelay += stagger;
                            },
                            a;
                        if (staggerOrder == 'default') {
                            children.forEach(childHandler);
                        } else {
                            a = Array.from(children);
                            switch (staggerOrder) {
                                case 'reverse':
                                    a.reverse();
                                    break;
                                case 'random':
                                    a.sort(function () {
                                        return Math.random() - 0.5;
                                    });
                                    break;
                            }
                            a.forEach(childHandler);
                        }
                    } : enter,
                    leave: (replay ? (children ? function () {
                        children.forEach(function (e) {
                            leave.apply(e);
                        });
                    } : leave) : null),
                });
            });
        },
    };

    function videoBackground(id, settings) {
        var _this = this;
        this.id = id;
        this.src = settings.src;
        this.poster = settings.poster;
        this.position = settings.position;
        this.loop = settings.loop;
        this.$target = $(settings.target);
        this.$video = null;
        this.init();
    };
    videoBackground.prototype.autoplay = function () {
        if (client.os != 'ios' && client.os != 'android' && client.os != 'undefined') return true;
        switch (client.os) {
            case 'ios':
                if (client.osVersion >= 10 && (client.browser == 'safari' || client.browser ==
                        'chrome')) return true;
                break;
            case 'android':
                if ((client.browser == 'chrome' && client.browserVersion >= 54) || (client.browser ==
                        'firefox' && client.browserVersion >= 49)) return true;
                break;
            default:
                break;
        }
        return false;
    };
    videoBackground.prototype.init = function () {
        if (this.autoplay()) {
            this.$video = document.createElement('video');
            this.$video.src = this.src;
            this.$video.poster = this.poster;
            this.$video.autoplay = true;
            this.$video.muted = true;
            this.$video.preload = 'auto';
            this.$video.loop = this.loop;
            this.$video.playsInline = true;
            this.$video.disablePictureInPicture = true;
            this.$video.disableRemotePlayback = true;
            this.$video.setAttribute('webkit-playsinline', '');
            this.$video.setAttribute('muted', '');
            this.$target.appendChild(this.$video);
            this.$video.play();
        } else this.$target.style.backgroundImage = 'url(\'' + this.poster + '\')';
    };
    (function () {
        var $bg = document.createElement('div');
        $bg.id = 'bg';
        $body.insertBefore($bg, $body.firstChild);
        new videoBackground('bg', {
            target: '#bg',
            src: 'https://cdn.discordapp.com/attachments/972906189795000490/1051373813838913586/tiu10k.mp4',
            poster: 'assets/videos/bg.mp4.jpg?v=2bc54711',
            position: 'center',
            loop: true
        });
    })();

    function form(id, settings) {
        var _this = this;
        this.id = id;
        this.mode = settings.mode;
        this.method = settings.method;
        this.code = ('code' in settings ? settings.code : null);
        this.success = settings.success;
        this.initHandler = ('initHandler' in settings ? settings.initHandler : null);
        this.presubmitHandler = ('presubmitHandler' in settings ? settings.presubmitHandler : null);
        this.failure = ('failure' in settings ? settings.failure : null);
        this.optional = ('optional' in settings ? settings.optional : []);
        this.events = ('events' in settings ? settings.events : {});
        this.recaptcha = ('recaptcha' in settings ? settings.recaptcha : null);
        this.$form = $('#' + this.id);
        this.$form.addEventListener('change', function (event) {
            if (event.target.tagName != 'INPUT') return;
            _this.refreshInput(event.target);
        });
        this.$form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.triggerSubmit();
        });
        this.$form.addEventListener('keydown', function (event) {
            if (event.keyCode == 13 && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                _this.triggerSubmit();
            }
        });
        var x = $('#' + this.id + ' input[name="' + settings.hid + '"]');
        if (x) {
            x.disabled = true;
            x.parentNode.style.display = 'none';
        }
        this.$submit = $('#' + this.id + ' .actions button[type="submit"]');
        this.$submit.disabled = false;
        this.initInputs();
        if (this.initHandler) {
            errors.handle(function (message) {
                return _this.failureHandler(message);
            });
            if (!this.initHandler()) errors.unhandle();
        }
        if (this.recaptcha) {
            grecaptcha.ready(function () {
                var id;
                id = grecaptcha.render(_this.$submit, {
                    sitekey: _this.recaptcha.key,
                    isolated: true,
                    theme: (_this.recaptcha.darkMode ? 'dark' : 'light'),
                    callback: function (token) {
                        _this.submit({
                            recaptchaToken: token
                        }, ['g-recaptcha-response']);
                        grecaptcha.reset(id);
                    }
                });
            });
        }
    };
    form.prototype.refreshInput = function (input) {
        var a = [],
            p;
        switch (input.type) {
            case 'file':
                p = input.parentNode;
                if (input.files.length > 0) p.setAttribute('data-filename', input.files[0].name);
                else p.setAttribute('data-filename', '');
                break;
            default:
                break;
        }
    };
    form.prototype.refreshInputs = function () {
        var i;
        for (i = 0; i < this.$form.elements.length; i++) this.refreshInput(this.$form.elements[i]);
    };
    form.prototype.normalizeNumberInput = function (input) {
        var min = parseFloat(input.min),
            max = parseFloat(input.max),
            step = parseFloat(input.step),
            v = parseFloat(input.value);
        if (isNaN(v)) {
            if (!input.required) {
                input.value = null;
                return;
            }
            v = isNaN(min) ? 0 : min;
        }
        if (!isNaN(min) && v < min) v = min;
        if (!isNaN(max) && v > max) v = max;
        if (!isNaN(step) && (v % step) !== 0) v = Math.round(v / step) * step;
        switch (input.dataset.category) {
            case 'currency':
                v = parseFloat(v).toFixed(2);
                break;
            default:
            case 'decimal':
                v = parseFloat(v);
                break;
            case 'integer':
                v = parseInt(v);
                break;
        }
        input.value = v;
    };
    form.prototype.initInputs = function () {
        var _this = this,
            i, input;
        for (i = 0; i < this.$healer1.elements.length; i++) {
            input = this.$form.elements[i];
            switch (input.type) {
                case 'number':
                    (function (input) {
                        var p = input.parentNode,
                            decrement = p.querySelector('button.decrement'),
                            increment = p.querySelector('button.increment');
                        input.addEventListener('blur', function (event) {
                            _this.normalizeNumberInput(input);
                        });
                        if (decrement && increment) {
                            decrement.addEventListener('click', function (event) {
                                event.preventDefault();
                                _this.normalizeNumberInput(input);
                                input.stepDown(1);
                                _this.normalizeNumberInput(input);
                            });
                            increment.addEventListener('click', function (event) {
                                event.preventDefault();
                                _this.normalizeNumberInput(input);
                                input.stepUp(1);
                                _this.normalizeNumberInput(input);
                            });
                        }
                    })(input);
                    break;
                case 'file':
                    (function (input) {
                        var p = input.parentNode,
                            select = p.querySelector('button.select');
                        select.addEventListener('click', function (event) {
                            event.preventDefault();
                            input.click();
                        });
                        input.addEventListener('focus', function (event) {
                            event.target.parentNode.classList.add('focus');
                        });
                        input.addEventListener('blur', function (event) {
                            event.target.parentNode.classList.remove('focus');
                        });
                    })(input);
                    break;
                case 'text':
                case 'textarea':
                case 'email':
                    input.addEventListener('blur', function (event) {
                        this.value = this.value.replace(/^\s+/, '').replace(/\s+$/, '');
                    });
                    break;
            }
            this.refreshInput(input);
        }
    };
    form.prototype.notify = function (type, message) {
        var isHref = !!(message.match(
                /^(#[a-zA-Z0-9\_\-]+|[a-z0-9\-\.]+:[a-zA-Z0-9\~\!\@\#$\%\&\-\_\+\=\;\,\.\?\/\:\{\}\|]+)$/
            )),
            input, value;
        if (typeof variables !== 'undefined') {
            if (variables.hasVariables(message)) {
                for (input of this.$form.elements) {
                    if (!this.isAllowedInput(input)) continue;
                    value = '';
                    if (this.isValidInput(input)) {
                        switch (input.type) {
                            case 'checkbox':
                                value = input.checked ? 'true' : 'false';
                                break;
                            case 'email':
                            case 'select-one':
                            case 'number':
                            case 'tel':
                            case 'text':
                            case 'textarea':
                            case 'hidden':
                                value = input.value;
                                break;
                            default:
                                value = '';
                                break;
                        }
                    } else value = '';
                    if (isHref) value = encodeURIComponent(value);
                    message = variables.replaceVariable(message, input.name, value);
                }
            }
            message = variables.parseString(this.$form, message);
        }
        if (isHref) location.href = message;
        else alert((type == 'failure' ? 'ERROR: ' : '') + message);
    };
    form.prototype.getRequiredInputValue = function (name, type) {
        var input;
        for (input of this.$form.elements) {
            if (((Array.isArray(type) && type.includes(input.type)) || input.type == type) && input
                .name == name && input.value !== '' && input.value !== null) return input.value;
        }
        return null;
    };
    form.prototype.getEmail = function () {
        return this.getRequiredInputValue('email', 'email');
    };
    form.prototype.getAmount = function () {
        var x;
        x = this.getRequiredInputValue('amount', ['select-one', 'number']);
        if (!x) return null;
        x = parseFloat(x);
        if (isNaN(x) || x < 1.00 || x > 100000.00) return null;
        return x;
    };
    form.prototype.values = function () {
        var a = {};
        for (i in this.$form.elements) {
            e = this.$form.elements[i];
            if (!e.name || !e.value) continue;
            switch (e.type) {
                case 'checkbox':
                    a[e.name] = (e.checked ? 'checked' : null);
                    break;
                case 'file':
                    a[e.name] = {
                        name: e.files[0].name,
                        blob: new Blob([e.files[0]], {
                            type: e.files[0].type
                        })
                    };
                    break;
                default:
                    a[e.name] = e.value;
                    break;
            }
        }
        a['id'] = this.id;
        return a;
    };
    form.prototype.scrollIntoView = function () {
        window.scrollTo(0, this.$form.offsetTop);
    };
    form.prototype.triggerSubmit = function () {
        if (this.recaptcha) this.$submit.click();
        else if (!this.$submit.disabled) this.submit();
    };
    form.prototype.isAllowedInput = function (input, ignore) {
        try {
            if (!input || typeof input != 'object' || !('name' in input)) throw 'Not an input.';
            if (ignore && ignore.indexOf(input.name) != -1) throw 'Input is ignored.';
            if (input.disabled) throw 'Input is disabled.';
            switch (input.type) {
                case 'text':
                case 'email':
                case 'textarea':
                case 'select-one':
                case 'checkbox':
                case 'number':
                case 'tel':
                case 'file':
                case 'hidden':
                    break;
                default:
                    throw 'Not an allowed input.';
            }
        } catch (e) {
            return false;
        }
        return true;
    };
    form.prototype.finalizeInput = function (input) {
        try {
            if (!input || typeof input != 'object' || !('name' in input)) throw 'Not an input.';
            if (!('value' in input)) throw 'Missing "value" property.';
            if (input.type == 'text' || input.type == 'email' || input.type == 'textarea' || input
                .type == 'hidden') input.value = input.value.replace(/^\s+/, '').replace(/\s+$/, '');
        } catch (e) {}
    };
    form.prototype.isValidInput = function (input) {
        var result = false;
        switch (input.type) {
            case 'email':
                result = input.value.match(new RegExp(
                    "^([a-zA-Z0-9\\_\\-\\.\\+]+)@([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]+)$"));
                break;
            case 'select-one':
                result = input.value.match(new RegExp("^[^\\<\\>]+$"));
                break;
            case 'checkbox':
                result = true;
                break;
            case 'number':
                result = input.value.match(new RegExp("^[0-9\\-\\.]+$"));
                break;
            case 'tel':
                result = input.value.match(new RegExp("^[0-9\\-\\+\\(\\)\\ \\#\\*]+$"));
                break;
            case 'file':
                result = true;
                break;
            default:
            case 'text':
            case 'textarea':
            case 'hidden':
                result = input.value.match(new RegExp("^[^\\<\\>]+$"));
                break;
        }
        return result;
    };
    form.prototype.submit = function (values, ignore) {
        var _this = this,
            input, result, _success, _failure, a, i, e, fd, k, x;
        try {
            for (input of this.$form.elements) {
                if (!this.isAllowedInput(input, ignore)) continue;
                if (this.optional.indexOf(input.name) !== -1 && (input.value === '' || input.value ===
                        null || (input.type == 'checkbox' && !input.checked))) continue;
                this.finalizeInput(input);
                if (!this.isValidInput(input)) throw 'Not valid.';
            }
        } catch (e) {
            this.notify('failure', 'Missing or invalid fields. Please try again.');
            return;
        }
        if ('onsubmit' in this.events) {
            if (this.events.onsubmit.apply(this.$form) === false) return;
        }
        switch (this.method) {
            default:
            case 'ajax':
                break;
            case 'get':
            case 'post':
                this.$form.submit();
                return;
            case 'code':
                if (typeof this.code == 'function') {
                    this.waiting(true);
                    _success = function () {
                        if ('onsuccess' in _this.events) _this.events.onsuccess.apply(_this.$form);
                        _this.notify('success', _this.success);
                        _this.waiting(false);
                    };
                    _failure = function () {
                        if ('onfailure' in _this.events) _this.events.onfailure.apply(_this.$form);
                        _this.notify('failure', _this.failure ? _this.failure :
                            'Missing or invalid fields. Please try again.');
                        _this.waiting(false);
                    };
                    result = this.code.apply(this.$form, [_success, _failure]);
                    if (result === true) _success();
                    else if (result === false) _failure();
                }
                return;
        }
        if (x = $(':focus')) x.blur();
        errors.handle(function (message) {
            return _this.failureHandler(message);
        });
        a = this.values();
        if (values) {
            for (k in values) a[k] = values[k];
        }
        if (this.presubmitHandler) this.presubmitHandler.call(this, a);
        else this.submitHandler(a);
    };
    form.prototype.submitHandler = function (values) {
        var _this = this,
            x, k, data;
        this.waiting(true);
        data = new FormData;
        for (k in values) {
            if (values[k] && typeof values[k] == 'object' && ('blob' in values[k])) data.append(k,
                values[k].blob, values[k].name);
            else data.append(k, values[k]);
        }
        x = new XMLHttpRequest();
        x.open('POST', ['', 'post', this.mode].join('/'));
        x.send(data);
        x.onreadystatechange = function () {
            var o;
            if (x.readyState != 4) return;
            if (x.status != 200) throw new Error('Failed server response (' + x.status + ')');
            try {
                o = JSON.parse(x.responseText);
            } catch (e) {
                throw new Error('Invalid server response');
            }
            if (!('result' in o) || !('message' in o)) throw new Error(
                'Incomplete server response');
            if (o.result !== true) throw new Error(o.message);
            if ('onsuccess' in _this.events) _this.events.onsuccess.apply(this.$form);
            _this.notify('success', (_this.success ? _this.success : o.message));
            _this.$form.reset();
            _this.refreshInputs();
            _this.waiting(false);
            errors.unhandle();
        };
    };
    form.prototype.failureHandler = function (message) {
        console.log('failed (' + message + ')');
        if ('onfailure' in this.events) this.events.onfailure.apply(this.$form);
        if (message.match(/ALERT:/)) window.alert(message.substring(message.indexOf('ALERT:') + 7));
        else this.notify('failure', (this.failure ? this.failure : message));
        this.waiting(false);
        errors.unhandle();
        return true;
    };
    form.prototype.waiting = function (x) {
        var _this = this;
        if (x) {
            $body.classList.add('is-instant');
            this.$submit.disabled = true;
            this.$submit.classList.add('waiting');
            if (this.recaptcha) setTimeout(function () {
                _this.$submit.disabled = true;
            }, 0);
        } else {
            $body.classList.remove('is-instant');
            this.$submit.classList.remove('waiting');
            this.$submit.disabled = false;
        }
    };
    form.prototype.pause = function (values, handler) {
        var _this = this;
        this.waiting(true);
        db.open('formData', function (objectStore) {
            db.delete(objectStore, _this.id, function () {
                db.put(objectStore, values, function () {
                    handler.call(_this);
                });
            });
        });
    };
    form.prototype.resume = function (handler) {
        var _this = this;
        this.waiting(true);
        this.scrollIntoView();
        db.open('formData', function (objectStore) {
            db.get(objectStore, _this.id, function (values) {
                db.delete(objectStore, _this.id, function () {
                    var e, i, v;
                    for (i in _this.$form.elements) {
                        e = _this.$form.elements[i];
                        if (!e.name) continue;
                        v = (e.name in values ? values[e.name] : null);
                        switch (e.type) {
                            case 'checkbox':
                                e.checked = (v == 'checked' ? true : false);
                                break;
                            case 'file':
                                if (v) e.parentNode.setAttribute(
                                    'data-filename', v.name);
                                break;
                            default:
                                e.value = v;
                                break;
                        }
                    }
                    handler.call(_this, values);
                });
            });
        });
    };
    new form('healer1', {
        mode: 'custom',
        method: 'ajax',
        hid: 'message',
        success: 'Thank you! :)',
        failure: 'Sorry, something went wrong. Please try again later.',
        optional: [],
    });
    onvisible.add('.image.style1', {
        style: 'fade-up',
        speed: 1000,
        intensity: 1,
        delay: 0,
        staggerOrder: '',
        replay: false
    });
    onvisible.add('h1.style1, h2.style1, h3.style1, p.style1', {
        style: 'fade-left',
        speed: 1000,
        intensity: 1,
        delay: 0,
        staggerOrder: '',
        replay: false
    });
    onvisible.add('h1.style2, h2.style2, h3.style2, p.style2', {
        style: 'fade-left',
        speed: 1000,
        intensity: 0,
        delay: 0,
        staggerOrder: '',
        replay: false
    });
    onvisible.add('.icons.style1', {
        style: 'fade-left',
        speed: 1000,
        intensity: 0,
        delay: 0,
        stagger: 125,
        replay: false
    });
    onvisible.add('h1.style3, h2.style3, h3.style3, p.style3', {
        style: 'fade-left',
        speed: 1000,
        intensity: 1,
        delay: 0,
        staggerOrder: '',
        replay: false
    });
    onvisible.add('#healer1', {
        style: 'fade-left',
        speed: 1000,
        intensity: 5,
        delay: 0,
        staggerOrder: '',
        replay: false
    });
})();
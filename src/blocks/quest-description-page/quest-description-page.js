/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 0 */
/* добавлякем несколько listeners на элемент
 ** @param {DOMElement} element - DOM element
 ** @param {string} eventNames - имена событий через пробел
 ** @param {Function} listener - функция обработки события
 */
function addListenerMulti(element, eventNames, listener) {
    let events = eventNames.split(' ');
    for (let i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
    }
}

function getCursorInfo(e) {
    if ('touches' in e) {
        return e.touches[0];
    }

    return e;
}

function initDraggable() {
    const draggable = document.querySelector('.draggable');
    const mainBlock = document.querySelector('.description-and-photos');
    const scroll = mainBlock.querySelector('.scroll');
    const constSpeed = 0.5;
    let imgMargin;
    let draggablePaddingRight;
    let direction = 1;
    let scrollLeft = 0;
    let scrollWidth = 0;
    let divRight = 0;
    let speed = constSpeed;
    let speedDecreaseFactor = 0.9;
    let prevX;
    let lastX;
    let prevScrollX = 0;
    let scrollClicked = false;
    let draggableClicked = false;
    draggablePaddingRight = parseInt(window.getComputedStyle(draggable).paddingRight);
    let draggableWidth = draggable.clientWidth;
    imgMargin = parseInt(window.getComputedStyle(draggable
        .querySelector('.quest-description-page-photo-block img')).margin);
    let div = draggable.querySelector('.quest-description-page-photo-block');
    let divWidth = div.scrollWidth;
    scrollWidth = draggableWidth / (divWidth + (2 * draggablePaddingRight)) * draggableWidth;
    if (scrollWidth === draggableWidth) {
        scroll.style.display = 'None';
        draggable.style.cursor = 'default';

        return;
    }
    scroll.style.width = scrollWidth + 'px';
    addListenerMulti(draggable, 'mousedown touchstart', e => {
        speed = 0;
        draggableClicked = true;
        prevX = lastX = getCursorInfo(e).pageX;
        e.preventDefault();
    });
    addListenerMulti(scroll, 'mousedown touchstart', e => {
        speed = 0;
        scrollClicked = true;
        prevScrollX = lastX = getCursorInfo(e).pageX;
        e.preventDefault();
    });
    const ratio = draggableWidth / divWidth;
    const value = draggableWidth - scrollWidth;
    setInterval(() => {
        if (speed * ratio * direction + scrollLeft > 0 && speed * ratio * direction + scrollLeft < value) {
            scrollLeft += speed * ratio * direction;
            scroll.style.left = scrollLeft + 'px';
            divRight += speed * direction;
            div.style.right = divRight + 'px';
        } else {
            direction *= -1;
        }
        if (!draggableClicked && !scrollClicked) {
            speed *= speedDecreaseFactor;
            if (speed < constSpeed) {
                speed = constSpeed;
            }
        }
    }, 15);

    addListenerMulti(document, 'mouseup touchend', e => {
        draggableClicked = false;
        scrollClicked = false;
    });

    addListenerMulti(document, 'mousemove touchmove', e => {
        let draggableWidth = draggable.clientWidth;
        if (draggableClicked || scrollClicked) {
            draggable.querySelectorAll('.quest-description-page-photo-block').forEach(div => {
                let divWidth = div.scrollWidth;
                let shift = draggableClicked ? divRight + prevX - getCursorInfo(e).pageX :
                    scrollLeft - prevScrollX + getCursorInfo(e).pageX;
                if (shift < 0) {
                    shift = 0;
                }
                if (draggableClicked) {
                    if (shift > divWidth - draggableWidth + imgMargin) {
                        shift = divWidth - draggableWidth + imgMargin;
                    }
                    scrollLeft = shift * draggableWidth / divWidth;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift;
                    div.style.right = divRight + 'px';
                    direction = getCursorInfo(e).pageX - prevX < 0 ? 1 : -1;
                    lastX = prevX;
                    prevX = getCursorInfo(e).pageX;
                } else {
                    if (shift > draggableWidth - scrollWidth) {
                        shift = draggableWidth - scrollWidth;
                    }
                    scrollLeft = shift;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift * divWidth / draggableWidth;
                    div.style.right = divRight + 'px';
                    direction = getCursorInfo(e).pageX - prevScrollX < 0 ? -1 : 1;
                    lastX = prevScrollX;
                    prevScrollX = getCursorInfo(e).pageX;
                }
            });
            speed = Math.abs((getCursorInfo(e).pageX - lastX));
        }
    });
}

initDraggable();
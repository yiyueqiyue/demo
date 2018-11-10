var nav = document.getElementById("main-nav");
var sub = document.getElementById("sub-nav");
var lis = sub.getElementsByTagName("li");
var wrap = document.getElementById("promoInner");
var imgs = wrap.getElementsByTagName("li");
var spans = document.getElementById("promoTrigger").getElementsByTagName("span");
var timer = 0;
var index = 0;
var newLeft;

function mshow() {
    sub.style.display = "block";
}


function mhide() {
    sub.style.display = "none";
}

for (var i = 0; i < imgs.length; i++) {
    imgs[i].index = i;
    spans[i].index = i;

    spans[i].addEventListener("mouseover", function () {
        for (var j = 0; j < spans.length; j++) {
            removeClass(spans[j], "rn");
        }
        clearInterval(timer);
        wrap.style.left = -this.index * 604 + "px";
        index = this.index;
        addClass(this, "rn");
    })
    spans[i].addEventListener("mouseout", function () {
        addClass(this, "rn");
        timer = setInterval(function () {
            change(-604);
        }, 3000);
    })
}


function change(offset) {
    newLeft = parseInt(wrap.style.left) + offset;
    if (newLeft < -2416) {
        wrap.style.left = "0px";
        index = 0;
    } else {
        wrap.style.left = newLeft + "px";
        index += 1;
    }
    for (var j = 0; j < spans.length; j++) {
        removeClass(spans[j], "rn");
    }
    addClass(spans[index], "rn");
}

timer = setInterval(function () {
    change(-604);
}, 3000);


function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
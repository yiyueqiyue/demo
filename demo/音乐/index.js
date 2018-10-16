window.onload = function () {
    var rules = document.getElementById("rules");
    var progress = document.getElementById("progress");
    var mask = document.getElementById("mask");
    var button = document.getElementById("buttons").getElementsByTagName("button");
    var player = document.getElementById("mediaPlayer").getElementsByTagName("audio");
    var score = document.getElementById("score");
    // 随机播放音乐并判断
    function play() {
        var num = Math.floor(Math.random() * 7) ;
        player[num].play();
        console.log(num);
        button[num].onclick = function (ev) {
            score.textContent = (parseInt(score.textContent) + 10);
            button.onclick = null;
            player[num].load();
            setTimeout(play(),1000);
        };
        for(var i=0; i<button.length;i++){
            if(i != num ) {
                button[i].onclick = function () {
                    score.textContent = (parseInt(score.textContent) - 10);
                    button.onclick = null;
                    player[num].load();
                    setTimeout(play(),1000);
                }
            }
        }
    }

    var timer = 0;
    // 规则点击出现
    document.getElementById("rule").onclick = function () {
        rules.style.display = "block";
    };
    //  规则点击关闭
    document.getElementById("close").onclick = function () {
        rules.style.display = "none";
    };
    //  开始游戏
    document.getElementById("start").onclick = function () {
        this.style.display = "none";
        score.textContent = 0;
        progressHandler();
        showBtn();
        play();
    };


    function showBtn() {
        buttons.style.display = "block";
    }
    //  重新开始
    document.getElementById("restart").onclick = function () {
        mask.style.display = "none";
        score.textContent = 0;
        progressHandler();
        showBtn();
        play();
    };
    //  定义进度条
    function progressHandler() {
        progress.style.width = 123 + "px";
        // 开启定时器
        timer = setInterval(function () {
            // 拿到进度条宽度
            var progressWidth = parseInt(progress.style.width);
            // 减少当前宽度
            progressWidth -= 2;
            // 重新给进度条赋值宽度
            progress.style.width = progressWidth + "px";
            // 监听进度条是否走完
            if(progressWidth <= 3) {
                // 关闭计时器
                clearInterval(timer);
                mask.style.display = "block";
            }
        },1000)
    }
}
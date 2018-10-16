(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function (callBack) {
            var $this = this; //此时的this是progress
              //监听背景的点击
            this.$progressBar.click(function (event) {
                //获取背景距离窗口的默认位置
                var nLeft = $(this).offset().left;
                // console.log(nLeft);

                //获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // console.log(eventLeft);
                //设置前景的宽度
                $this.$progressLine.css("width",eventLeft-nLeft);
                $this.$progressDot.css("left",eventLeft-nLeft);

                //计算进度条比例
                var value = (eventLeft-nLeft) / $(this).width();
                callBack(value);
            });
        },
        progressMove: function (callBack) {
            var $this = this;
                //监听鼠标的按下事件
            var nLeft = $this.$progressBar.offset().left;
            var eventLeft;
            var barWidth = this.$progressBar.width();
            this.$progressBar.mousedown(function () {
                $this.isMove = true;

                //监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    // console.log(nLeft);
                    //获取点击的位置距离窗口的位置
                    eventLeft = event.pageX;
                    // console.log(eventLeft);
                    var offset = eventLeft-nLeft;
                    if(offset >= 0 && offset <= barWidth) {
                        $this.$progressLine.css("width",eventLeft-nLeft);
                        $this.$progressDot.css("left",eventLeft-nLeft);
                    }
                    //设置前景的宽度

                });

            });

                //监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                //计算进度条比例
                var value = (eventLeft-nLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress: function (value) {
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + "%"
            });
            this.$progressDot.css({
                left: value + "%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);
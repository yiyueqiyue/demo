(function (window) {
    function Lyric(path) {
        return Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        loadLyric: function (callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    // console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error:function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric: function (data) {
            var $this = this;
            this.times = [];
            this.lyrics = [];
            var array = data.split("\n");
            // console.log(array);
            // 遍历取出歌词
            var timeReg = /\[(\d*:\d*\.\d*)\]/ ;
            $.each(array,function (index, ele) {
                  // 处理歌词
                var lrc = ele.split("]")[1];
                if(lrc.length == 0) return true;
                 // 排除空字符
                $this.lyrics.push(lrc);

                var res = timeReg.exec(ele);
                // console.log(res);
                if(res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                // console.log(time);
                $this.times.push(time);
            });
            // console.log($this.lyrics);
            // console.log($this.times);
        },
        currentIndex: function (currentTime) {
            // console.log(currentTime);
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift(); //删除数组最前面的元素
            }
            return this.index;
        }

    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);
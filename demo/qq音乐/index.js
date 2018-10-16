$(function () {
            //自定义滚动条
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;

        //初始化进度条
    initProgress();
    function initProgress(){
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }
            //加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "source/source.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;

                //遍历音乐
                var $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    var $item = creatMusicitem(index,ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initLyricInfo(data[0]);

            },
            error:function (e) {
                console.log(e);
            }
        });
    }


        // 初始化歌曲信息
    function initMusicInfo(music) {
        // 获取对应元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name");
        var $musicSinger = $(".song_info_singer");
        var $musicAlbum = $(".song_info_ablum");
        var $musicProgressMame = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");

        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum .text(music.album);
        $musicProgressMame.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 /" +music.time);
        $musicBg.css("background","url('"+ music.cover+ "')");
    }

    //初始化歌词信息
    function initLyricInfo(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $(".song_lyric");

        //清空上一首歌词
        $lyricContainer.html("");
        lyric.loadLyric(function () {
            //创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>"+ ele +"</li>");
                $lyricContainer.append($item);
            })
        });
            }
            //初始化事件监听
    initEvents();
    function initEvents() {
        $(".content_list").delegate(".list_music","mouseenter",function () {
            //隐藏子菜单，显示时长
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            $(this).find(".list_time span").stop().fadeOut(0);
        });
        $(".content_list").delegate(".list_music","mouseleave",function () {
            //隐藏子菜单，显示时长
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(0);
        });

        //复选框的点击事件
        $(".content_list").delegate(".list_check", "click" ,function () {
            $(".list_check").click(function () {
                $(this).toggleClass(" list_checked");
            });
        });

        var $musicPlay = $(".music_play");
               //添加子菜单播放按钮的监听
        $(".content_list").delegate(".list_menu_play","click",function () {
            //切换播放图标
            var $item = $(this).parents(".list_music");
            $(this).toggleClass("list_menu_play2");
                //复原其他图标
            $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2");
                //同步底部播放按钮
            if($(this).attr("class").indexOf("list_menu_play2") != -1){
                //当前播放音乐
                $musicPlay.addClass("music_play2");
                //文字高亮
                $item.find("div").css("color","#fff");
                $item.siblings().find("div").css("color","rgba(255,255,255,.5)");
            }else{
                //当前停止播放音乐
                $musicPlay.removeClass("music_play2");
                //取消文字高亮
                $item.find("div").css("color","rgba(255,255,255,.5)");
            }
                //切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");
                //播放音乐
            player.playMusic( $item.get(0).index, $item.get(0).music);

                //切换歌曲信息
            initMusicInfo($item.get(0).music);
            initLyricInfo($item.get(0).music);
        });

               //监听上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });

                //监听底部播放按钮的点击
        $musicPlay.click(function () {
            if(player.currentIndex == -1){
                //没有播放音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                //播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
                //监听下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });
               //监听删除按钮
        $(".content_list").delegate(".list_menu_del","click" ,function () {
              //找到被点击的音乐
            var $item  = $(this).parents(".list_music");

              //判断删除的是否是当前音乐
            if($item.get(0).index == player.currentIndex){
                $(".music_next").toggle("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

               //重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            })
        });
                //监听播放的进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            $(".music_progress_time").text(timeStr);
                //同步进度条
                //计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);
              //实现歌词同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if(index <= 2 ) return;

            $(".song_lyric").css({
                marginTop: ((-index+2) * 30)
            })
        });
               //监听声音按钮的点击
        $(".music_voice_icon").click(function () {
              // 图标切换
              $(this).toggleClass("music_voice_icon2");
              // 声音切换
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //  无声
                player.musicVoiceSeekTo(0);
            }else{
                // 有声
                player.musicVoiceSeekTo(1);

            }
        });
               // 点击更改底部喜欢按钮
        $(".music_fav").click(function () {
            $(this).toggleClass("music_fav2");
        });
              // 点击更改播放模式
        $(".music_mode1").click(function () {
            $(this).toggleClass("music_mode2").click(function () {
                $(this).toggleClass("music_mode3").click(function () {
                    $(this).toggleClass("music_mode4");
                })
            });
        })
    }

    function creatMusicitem(index,music) {
    var $item = $("<li class=\"list_music\">\n" +
        "<div class=\"list_check\"><i></i></div>\n" +
        "<div class=\"list_number\">"+(index +1)+"</div>\n" +
        "<div class=\"list_name\">"+ music.name+
        "<div class=\"list_menu\">\n" +
          "<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n" +
          "<a href=\"javascript:;\" title=\"添加\"></a>\n" +
          "<a href=\"javascript:;\" title=\"下载\"></a>\n" +
          "<a href=\"javascript:;\" title=\"分享\"></a>\n" +
        "</div>\n" +
        "</div>\n" +
        "<div class=\"list_singer\">"+ music.singer + "</div>\n" +
        "<div class=\"list_time\">\n" +
          "<span>"+ music.time+ "</span>\n" +
          "<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\">\n" +
        " </div>\n" +
        " </li>");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
}

});



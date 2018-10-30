getList();
// 获取列表
function getList() {
    $.ajax({
        url: "All.json",
        dataType: 'json',
        success: function (data) {
            listener(data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

//  创建列表
function createList(index, list) {
    var $item = $(
        " <div class=\"list-wrapper\">\n" +
        "            <img class=\"list-pic\" src=" + "\"" + list.url + "\"" + " alt=\"\">\n" +
        "            <p>" + list.name + "</p>\n" +
        "        </div>"
    )
    var $list = $(".list");
    $list.append($item);
    return $item;
}


//  点击
$("label").click(function () {
    $(this).addClass("checked").siblings().removeClass("checked");
    $(".list").empty();
});

// 监听
function listener(data) {
    $.each(data, function (index, item) {
        $(".form").delegate("input", "click", function () {
            var i = $(".checked input[name='type']").val();
            var i2 = $(".checked input[name='price']").val();
            if ((item.price == i2 && item.type == i)
                || (item.price == i2 && i == 'all')
                || (i2 == 'all' && item.type == i)
                || (i == 'all' && i2 == 'all')) {
                createList(index, item);
            }
        })
        createList(index, item);
    })
}








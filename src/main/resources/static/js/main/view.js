$(document).ready(function () {
    var works = getViewWorks();
    var after = false;
    var vue = new Vue({
        el: '#view-body',
        data: {
            works: works,
            after: after
        }
    });

    layui.use(['form'], function () {
        var form = layui.form;
        //更改checkbox状态时也重新刷新一下查找列表
        form.on('checkbox', function (data) {
            refreshData();
        });
    });

    refreshData();

    $("#tip-point").click(function () {
        after = !after;
        works.reverse();
        vue.works = getSearchWork();
        vue.after = after;
        $("#tip-text").html(after ? "之后的任务" : "之前的任务");
    });

    function getSearchWork() {
        var info = $("#searchTitle").val();
        if (info == null) {
            info = "";
        }
        var str = ".*";
        //将搜索字符串拼接成正则表达式
        for (i = 0; i < info.length; i++) {
            str += info.charAt(i) + '.*';
        }
        var reg = new RegExp(str);
        var arr = [];
        for (var i = 0; i < works.length; i++) {
            var temp = [];
            for (var j = 0; j < works[i].length; j++) {
                if (reg.test(works[i][j].title + works[i][j].description)) {
                    if (!$("#search-org").is(':checked') && works[i][j].organizationName != null) {
                        continue;
                    }
                    if (!$("#search-done").is(':checked') && works[i][j].done) {
                        continue;
                    }
                    if (!$("#search-ignore").is(':checked') && works[i][j].unShow) {
                        continue;
                    }
                    temp.push(works[i][j]);
                }
            }
            if (temp.length > 0) {
                arr.push(temp);
            }
        }
        return arr;
    }

    function refreshData() {
        vue.works = getSearchWork();
    }

    //搜索框每次输入时都调用标题搜索功能
    $("#searchTitle").on('input', function () {
        refreshData();
    });

    //按下ESC键时清空输入框
    $(document).keydown(function (event) {
        if (event.keyCode === 27) {
            $("#searchTitle").val("");
            refreshData();
        }
    });

    function getViewWorks() {
        var data;
        $.ajax({
            async: false,
            type: "post",
            url: "/task/person/view",
            data: {},
            dataType: "json", //回调函数接收数据的数据格式
            success: function (msg) {
                if (msg.code === 1) {
                    data = msg.data;
                }
            },
            error: function (msg) {
                defaultErrorMsg();
            }
        });
        return data;
    }
});
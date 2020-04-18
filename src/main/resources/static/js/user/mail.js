$(document).ready(function () {
    layui.use(['slider', 'form'], function () {
        var form = layui.form;
        var slider = layui.slider;
        var mySettings = getUserMailSetting();
        initUserSetting(mySettings.settings);

        //每次对checkbox的点击都会触发这个函数
        form.on("checkbox", function (data) {
            var values = [];
            var settings = document.getElementsByName("setting");
            for (i = 0; i < settings.length; i++) {
                values.push(settings[i].checked);
            }
            mySettings.settings = values;
            updateMailSetting();
        });

        slider.render({
            elem: '#daySlider'  //绑定元素
            , min: 0
            , max: 7
            , value: mySettings.day
            , step: 1
            , input: true
            , change: function (value) {
                mySettings.day = value;
            }
        });

        $("#save-btn").click(function () {
            $.ajax({
                async: false,
                type: "post",
                url: "/user/update",
                data: {
                    "day": mySettings.day,
                    "settings": mySettings.settings
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code === 1) {
                        layer.msg("保存成功");
                    } else {
                        layer.msg(reply.msg);
                    }
                }, error: function (reply) {
                    layer.msg("未知错误");
                }
            });
        });

        $("#tip").click(function (data) {
            var tipStr = '任务提醒通知将会以邮件的形式在每天的06:00前发送到你的邮箱';
            //头部提示按钮
            layer.alert(tipStr, {
                skin: 'layui-layer-molv' //样式类名
                , closeBtn: 0
            });
        });

        function initUserSetting(mySettings) {
            var settings = document.getElementsByName("setting");
            for (var i = 0; i < mySettings.length; i++) {
                settings[i].checked = mySettings[i];
            }
            form.render();
        }

        function getUserMailSetting() {
            var setting = [];
            $.ajax({
                async: false,
                type: "post",
                url: "/user/get",
                dataType: "json",
                success: function (reply) {
                    if (reply.code === 1) {
                        setting = reply.data[0];
                    }
                    else {
                        layer.msg(reply.msg);
                    }
                }, error: function (reply) {
                    layer.msg("未知错误");
                }
            });
            return setting;
        }
    });
});
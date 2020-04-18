$(document).ready(function () {
    layui.use(['element', 'form', 'layer'], function () {
        var element = layui.element;
        var form = layui.form;

        form.val("form", {
            "user": $.cookie("account")
            , "secret": $.cookie("password")
            , "remember": $.cookie("remember") === "true"
        });

        form.on('submit(login)', function (data) {
            $.ajax({
                async: false,
                type: "post",
                url: "/login/login",
                data: {
                    "account": data.field.user,
                    "password": data.field.secret
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code === 1) {
                        rememberMe(data.field);
                        window.location.href = '/main';
                    } else {
                        layer.msg(reply.msg);
                    }
                },
                error: function (reply) {
                    layer.msg(reply.msg);
                }
            });
            return false;
        });
    });

    function rememberMe(data) {
        var remember = data.remember === "on";
        var day = 365;  //天
        $.cookie("remember", remember, {expires: day, path: '/login'});
        $.cookie("account", data.user, {expires: day, path: '/login'});
        if (remember) {
            $.cookie("password", data.secret, {expires: day, path: '/login'});
        } else {
            $.cookie("password", "", {expires: day, path: '/login'});
        }
    }
});
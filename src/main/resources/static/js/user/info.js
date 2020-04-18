$(document).ready(function () {
    var info = parent.window.info;
    var infoVue = new Vue({
        el: "#main",
        data: {
            info: info
        }
    });

    layui.use(['form', 'layer'], function () {
        var layer = layui.layer;
        var form = layui.form;
        //修改名字的时候
        $("#name-edit").click(function (data) {
            layer.prompt({title: '修改你的昵称', formType: 0, value: info.userName}, function (val, index) {
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(val)) {
                    layer.msg('用户名不能有特殊字符');
                    return false;
                }
                if (/^\d+\d$/.test(val)) {
                    layer.msg('用户名不能全为数字');
                    return false;
                }
                if (val.length < 2 || val.length > 6) {
                    layer.msg('用户名长度为2-6');
                    return false;
                }
                $.ajax({
                    async: false,
                    type: "post",
                    url: "/user/name",
                    data: {
                        "name": val
                    },
                    dataType: "json", //回调函数接收数据的数据格式
                    success: function (reply) {
                        if (reply.code == 1) {
                            info.userName = val;
                            parent.window.userNameVue.name = val;
                            layer.close(index);
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

        $("#password-edit").click(function (data) {
            layer.open({
                type: 2,
                // btn: [ '提交', '关闭'],
                area: ['400px', '320px'], //宽高
                title: '修改密码',
                content: '/html/user/edit-psw-iframe.html'
            });
        });

        var weChatTip = "后续微信账号连接功能，敬请期待";

        $("#wechat-bind").click(function (data) {
            layer.tips(weChatTip, "#wechat-bind");
        });
        $("#wechat-unbind").click(function (data) {
            layer.tips(weChatTip, "#wechat-unbind");
        });
    });
});
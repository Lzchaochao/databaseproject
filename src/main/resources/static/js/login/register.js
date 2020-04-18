//放一些基本上每个页面都需要用到的函数之类的东西
$(document).ready(function () {
    var verifyAble = true;
    layui.use(['form', 'element', 'layer'], function () {
        var element = layui.element;
        var layer = layui.layer;
        var form = layui.form;
        form.on('submit(register)', function (data) {
            $.ajax({
                async: false,
                type: "post",
                url: "/login/signup",
                data: {
                    "userMail": data.field.userMail,
                    "userName": data.field.userName,
                    "code": data.field.code,
                    "firstpsw": data.field.firstpsw,
                    "rdpsw": data.field.rdpsw
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code === 1) {
                        layer.msg("注册成功，记得先查看自己的邮箱通知设置哦");
                        setTimeout(function () {
                            window.location.href = '/login';
                        }, 1000);
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

        form.verify({
            username: function (value, item) {
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/^\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
                if (value.length < 2 || value.length > 6) {
                    return '用户名长度为2-6';
                }
            }
            , pass: [
                /^(\w){8,16}$/
                , '密码为8到16位，且只能输入英文、数字和下划线'
            ]
            , verifyCode: [
                /^(\w){6}$/
                , '请输入正确的验证码'
            ]
            , reCheck: function () {
                if ($("#first-screct").val() !== $("#rd-screct").val()) {
                    return '前后密码需一致';
                }
            }
        });

        $("#verifyCode").click(function (e) {
            if (!verifyAble) {
                return false;
            }
            var emreg = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
            var emailElm = $("#email");
            if (emreg.test(emailElm.val()) === false) {
                layer.tips('请填写正确的邮箱', emailElm, {
                    area: ['auto', 'auto'],
                    time: 2000,
                    tipsMore: true
                });
                return false;
            }
            $.ajax({
                async: true,
                type: "post",
                url: "/login/getcode",
                data: {
                    "userMail": emailElm.val(),
                    "register": true
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (data) {
                    if (data.code === 1) {
                        //data.code返回1表示邮箱可以用，返回0表示邮箱已经被占用
                        layer.msg("发送成功");
                        layui.use(['util'], function () {
                            var util = layui.util;
                            util.countdown(new Date().getTime() + 59000, new Date().getTime(), function (date, timer) {
                                $('#verifyCode').html('<p style="cursor: no-drop">' + date[3] + '秒后重试</p>');
                                if (date[3] == 0) {
                                    $('#verifyCode').html('<a href="javascript:;">重新获取</a>');
                                    verifyAble = true;
                                }
                            });
                        });
                        verifyAble = false;
                    } else {
                        layer.msg(data.msg);
                    }
                },
                error: function (msg) {
                    layer.msg("error");
                }
            });
            return false;
        });
        var usernameAble = true;
        var screctAble = true;

        $("#usename").on('focus', function () {
            if (usernameAble) {
                usernameAble = false;
                layer.tips('请控制长度在2-6个字符，且不支持特殊字符', $(this), {
                    area: ['auto', 'auto'],
                    time: 2000,
                    tipsMore: true
                });
            }
        });

        $("#first-screct").on('focus', function () {
            if (screctAble) {
                layer.tips('只能输入英文、数字和下划线,8-16位长', $(this), {
                    area: ['auto', 'auto'],
                    time: 2000,
                    tipsMore: true
                });
                screctAble = false;
            }
        });
    });
});

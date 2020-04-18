//放一些基本上每个页面都需要用到的函数之类的东西
$(document).ready(function () {
    var verifyAble = true;
    layui.use(['element', 'form', 'layer'], function () {
        var element = layui.element;
        var form = layui.form;
        var layer = layui.layer;
        form.on('submit(find-secret)', function (data) {
            $.ajax({
                async: false,
                type: "post",
                url: "/login/findback",
                data: {
                    "email": data.field.email,
                    "code": data.field.code,
                    "secret": data.field.secret,
                    "reSecret": data.field.reSecret
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code === 1) {
                        layer.msg("密码找回成功，即将跳转到登录界面");
                        setTimeout(function () {
                            window.location.href = '/login';
                        }, 1000);
                    } else {
                        layer.msg(reply.msg);
                    }
                },
                error: function (reply) {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg("服务器貌似出现了不可预知的异常，请重试或联系超超超，对您造成不便非常抱歉");
                    });
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
                if ($("#new-secret").val() !== $("#new2-secret").val()) {
                    return '前后密码需一致';
                }
            }
        });

        /**
         * 请求验证码
         * 前端校验逻辑待补充
         * 比如先验证邮箱正确性
         * 防止用户高频率点击
         */
        $("#getveritybutton").click(function () {
            if (!verifyAble) {
                return false;
            }
            var emreg = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
            var emailElm = $("#userEmail");
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
                    "register": false
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code === 1) {
                        //data.code返回1表示邮箱可以用，返回0表示邮箱已经被占用
                        layer.msg("发送成功");
                        layui.use(['util'], function () {
                            var util = layui.util;
                            util.countdown(new Date().getTime() + 59000, new Date().getTime(), function (date, timer) {
                                $('#getveritybutton').html('<p style="cursor: no-drop">' + date[3] + '秒后重试</p>');
                                if (date[3] == 0) {
                                    $('#getveritybutton').html('<a href="javascript:;">重新获取</a>');
                                    verifyAble = true;
                                }
                            });
                        });
                        verifyAble = false;
                    } else {
                        layer.msg(reply.msg);
                    }
                },
                error: function (msg) {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg("服务器貌似出现了不可预知的异常，请重试或联系超超超，对您造成不便非常抱歉");
                    });
                }
            });
            return false;
        });

        var secretAble = true;
        $("#new-secret").on('focus', function () {
            if (secretAble) {
                secretAble = false;
                layer.tips('只能输入英文、数字和下划线,8-16位长', $(this), {
                    area: ['auto', 'auto'],
                    time: 2000,
                    tipsMore: true
                });
            }
        });
    });
});
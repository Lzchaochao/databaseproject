//放一些基本上每个页面都需要用到的函数之类的东西
$(document).ready(function () {
    layui.use(['element', 'layer'], function () {
        var element = layui.element;
        var layer = layui.layer;
        $("#support").click(function () {
            console.log("click");
            layer.tab({
                area: ['500px', '400px'],
                tab: [{
                    title: '公益计划',
                    content: '<div style="padding-left:100px;padding-right:100px;padding-top:10px"><p style="font-size: 15px;text-align: center">腾讯公益-抗战老兵关爱计划</p><img src="../image/oldSoldier.png"></div>'
                }, {
                    title: '支付宝',
                    content: '<div style="padding-left:100px;padding-right:100px;padding-top:30px"><img src="../image/alipay.jpg"></div>'
                }, {
                    title: '微信',
                    content: '<div style="padding-left:100px;padding-right:100px;padding-top:30px"><img src="../image/wechatpay.jpg"></div>'
                }]
            });
        });

        $("#contact").click(function () {
            layer.tab({
                area: ['400px', '400px'],
                tab: [{
                    title: '微信',
                    content: '<div style="padding-left:50px;padding-right:50px;padding-top:25px"><img src="../image/wechat.jpg"></div>'
                }, {
                    title: 'QQ邮箱',
                    content: '<div style="text-align:center; font-size: 20px; padding-top:70px; line-height:50px;">lzchaochao@qq.com<br>使用过程中出现任何错误可以反馈给超超超<br>如果有什么好的建议也可以反馈给超超超<br></div>'
                }]
            });
        });
    });

    window.info = getUserInfo();

    window.userNameVue = new Vue({
        el: '#username',
        data: {
            name: info.userName
        }
    });

    var count = getNoticeLength();

    window.tipsVue = new Vue({
        el: '#noticeCount',
        data: {
            count: count
        }
    });

    //底部提示栏的提示信息，将来用来写备案号的
    var footVue = new Vue({
        el: "#foot-tip",
        data: {
            tip: "made by ccc at 2020",
            href: "http://www.miit.gov.cn/",
            beian: "粤ICP备20019128号-1"
        }
    });

    //退出登录按钮
    $("#doLogout").click(function () {
        $.ajax({
            async: false,
            type: "post",
            url: "/login/logout"
        });
        userNotLogin();
    });

    //获取用户的未读消息长度
    function getNoticeLength() {
        var length = 0;
        $.ajax({
            async: false,
            type: "post",
            url: "/req/get-len",
            data: {},
            dataType: "json", //回调函数接收数据的数据格式
            success: function (msg) {
                if (msg.code === 1) {
                    length = msg.data[0];
                } else {
                    defaultErrorMsg();
                }
            },
            error: function (msg) {
                defaultErrorMsg();
            }
        });
        return length;
    }

    //获取用户的个人信息，像用户名邮箱这些
    function getUserInfo() {
        var info = null;
        $.ajax({
            async: false,
            type: "post",
            url: "/user/info",
            dataType: "json",
            success: function (reply) {
                if (reply.code === 1) {
                    info = reply.data[0];
                } else if (reply.code === 2) {
                    layui.use('element', function () {
                        var element = layui.element;
                        layer.msg(reply.msg);
                    });
                }
                else {
                    defaultErrorMsg();
                }
            }, error: function () {
                defaultErrorMsg();
            }
        });
        return info;
    }
});

function defaultErrorMsg() {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.msg("服务器貌似出现了不可预知的异常，请重试或联系超超超，对您造成不便非常抱歉");
    });
}

//页面跳转函数
function changeFrame(url) {
    $("#main-body").attr("src", '/html/' + url + '.html');
}

//如果服务器返回错误代码0则跳转到登录界面
function userNotLogin() {
    window.location.href = '/login';
}


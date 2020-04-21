//放一些基本上每个页面都需要用到的函数之类的东西
$(document).ready(function () {
    layui.use(['element', 'layer'], function () {
        var element = layui.element;
        var layer = layui.layer;

    });

    // window.info = getUserInfo();

    // window.userNameVue = new Vue({
    //     el: '#username',
    //     data: {
    //         name: info.userName
    //     }
    // });

    // var count = getNoticeLength();

    // window.tipsVue = new Vue({
    //     el: '#noticeCount',
    //     data: {
    //         count: count
    //     }
    // });

    //底部提示栏的提示信息，将来用来写备案号的
    var footVue = new Vue({
        el: "#foot-tip",
        data: {
            tip: "made by ccc and wjj",
            href: "",
            beian: "SCAU 2017 CS2"
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


    // //获取用户的个人信息，像用户名邮箱这些
    // function getUserInfo() {
    //     var info = null;
    //     $.ajax({
    //         async: false,
    //         type: "post",
    //         url: "/user/info",
    //         dataType: "json",
    //         success: function (reply) {
    //             if (reply.code === 1) {
    //                 info = reply.data[0];
    //             } else if (reply.code === 2) {
    //                 layui.use('element', function () {
    //                     var element = layui.element;
    //                     layer.msg(reply.msg);
    //                 });
    //             }
    //             else {
    //                 defaultErrorMsg();
    //             }
    //         }, error: function () {
    //             defaultErrorMsg();
    //         }
    //     });
    //     return info;
    // }
});

function defaultErrorMsg() {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.msg("服务器貌似出现了不可预知的异常，请重试或联系超超超，对您造成不便非常抱歉");
    });
}

//页面跳转函数
function changeFrame(url) {
    $("#main-body").attr("src", '/html/' + url);
}

//如果服务器返回错误代码0则跳转到登录界面
function userNotLogin() {
    window.location.href = '/login';
}


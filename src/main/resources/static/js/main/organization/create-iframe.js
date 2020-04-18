$(document).ready(function () {
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    layui.use(['form'], function () {
        var form = layui.form;
        //监听提交
        form.on('submit(create)', function (data) {
            $.ajax({
                async: false,
                type: "post",
                url: "/org/admin/create",
                data: {
                    "name": data.field.name,
                    "description": data.field.desc
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code == 1) {
                        //此处返回创建的组织的信息
                        var data = reply.data[0];
                        var tip = "创建成功，组织 " + data.organizationName + " 的邀请码为 " + data.inviteCode;
                        parent.layer.msg(tip, {shade: 0.3, time: 700});
                        parent.window.addCreateOrganization(data);
                    } else {
                        parent.layer.msg(reply.msg, {shade: 0.3, time: 700});
                    }
                    parent.layer.close(index);//关闭窗口
                },
                error: function (reply) {
                    layer.msg(reply.msg);
                }
            });
            return false;
        });
    });
});
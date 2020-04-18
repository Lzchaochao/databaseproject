$(document).ready(function () {
    var data = parent.window.updateData;    //从父页面获取当前要修改的任务
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    layui.use(['form', 'layer'], function () {
        var form = layui.form;
        var layer = layui.layer;
        $("#organizationName").val(data.organizationName);
        $("#description").val(data.description);
        form.on('submit(update)', function (click) {
            //如果内容没有修改就没必要更新到数据库了
            if (data.organizationName === click.field.organizationName && data.description === click.field.desc) {
                parent.layer.close(index);//关闭窗口
                return false;
            }
            data.organizationName = click.field.organizationName;
            data.description = click.field.desc;
            $.ajax({
                async: false,
                type: "post",
                url: "/org/admin/update",
                data: {
                    "orgId": data.organizationId,
                    "organizationName": data.organizationName,
                    "description": data.description
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code == 1) {
                        parent.layer.msg('修改成功', {shade: 0.3, time: 700}); //提示
                        parent.window.setUpdateDataFromIFrame(data);   //调用父页面函数执行数据表更新操作
                        parent.layer.close(index);//关闭窗口
                    } else {
                        layer.msg(reply.msg);
                    }
                },
                error: function (reply) {
                    layer.msg('error');
                }
            });
            return false;
        });

        $("#cancel").click(function (data) {
            parent.layer.close(index);//关闭窗口
            return false;
        });
    });
});
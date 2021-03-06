$(document).ready(function () {
    var data = parent.window.updateData;    //从父页面获取当前要修改的任务
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var selectDate = data.deadLine + ":00";
    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        //以下初始化
        $("#title").val(data.title);
        $("#description").val(data.description);
        laydate.render({
            elem: '#dateinput'
            , type: 'datetime'
            , format: 'yyyy/MM/dd HH:mm:ss'
            , min: 'new Date()'
            , value: data.deadLine + ":00"    //服务器返回的数据没有秒所以要添加上去
            , done: function (value) {
                //每次改变就将得到日期的值赋值给变量，如：2017/08/18
                selectDate = value;
            }
        });

        form.on('submit(update)', function (click) {
            //如果没有修改东西就不用发到服务器了
            if (data.title === click.field.title &&
                data.description === click.field.desc &&
                data.deadLine === selectDate
            ) {
                parent.layer.close(index);//关闭窗口
                return false;
            }
            data.title = click.field.title;
            data.description = click.field.desc;
            data.deadLine = selectDate;
            $.ajax({
                async: false,
                type: "post",
                url: "/task/admin/update",
                data: {
                    "organizationWorkId": data.organizationWorkId,
                    "title": data.title,
                    "deadLine": data.deadLine,
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
    });

    $("#cancel").click(function (data) {
        parent.layer.close(index);//关闭窗口
        return false;
    })
});
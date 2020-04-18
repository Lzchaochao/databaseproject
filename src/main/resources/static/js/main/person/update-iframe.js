$(document).ready(function () {
    var data = parent.window.updateData;    //从父页面获取当前要修改的任务
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    var selectDate = data.deadLine + ":00";
    //使用vue动态渲染修改页面按钮的switch状态
    var doneSwitch = new Vue({
        el: '#doneCheck',
        data: {
            checkStatu: data.done
        }
    });
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
            , value: selectDate
            , done: function (value, date) {
                //每次改变就将得到日期的值赋值给变量，如：2017/08/18
                selectDate = value;
            }
        });

        form.on('submit(updateShort)', function (click) {
            if (data.title === click.field.title &&
                data.done === click.field.done &&
                data.description === click.field.desc &&
                data.deadLine === selectDate) {
                parent.layer.close(index);//关闭窗口
                return false;
            }
            data.title = click.field.title;
            data.done = click.field.done;
            data.description = click.field.desc;
            data.deadLine = selectDate;
            $.ajax({
                async: false,
                type: "post",
                url: "/task/person/update",
                data: {
                    "litterId": data.litterId,
                    "title": data.title,
                    "deadLine": data.deadLine,
                    "done": data.done,
                    "description": data.description
                },
                dataType: "json", //回调函数接收数据的数据格式
                success: function (reply) {
                    if (reply.code === 1) {
                        parent.layer.msg('修改成功', {shade: 0.3, time: 700}); //提示
                        parent.window.setUpdateDataFromIFrame(data);   //调用父页面函数执行数据表更新操作
                        /**
                         * 对数据的引用是obj引用，所以在这里的data值修改后不需要进一步传值，
                         * 已经是直接修改了父页面tableData里面的数据了
                         *
                         * 怎么又不行了  1/14 00:37 睡觉了 不管了我又不搞前端
                         *
                         * 到最后还是要传值啊什么东西嘛不管了
                         */
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
    });
});
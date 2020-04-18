$(document).ready(function () {
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var selectDate = null;
        //执行一个laydate实例
        laydate.render({
            elem: '#dateinput'
            , type: 'datetime'
            , min: 'new Date()'
            , format: 'yyyy/MM/dd HH:mm:ss'
            , done: function (value) {
                //每次改变就将得到日期的值赋值给变量，如：2017/08/18
                selectDate = value;
            }
        });

        //监听提交
        form.on('submit(add)', function (data) {
            if (data.field.org == null || data.field.org === "") {
                layer.msg("请选择组织");
                return false;
            }
            $.ajax({
                async: false,
                type: "post",
                url: "/task/admin/add",
                data: {
                    "organizationId": data.field.org,
                    "title": data.field.title,
                    "description": data.field.desc,
                    "deadLine": selectDate
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code == 1) {
                        //添加任务成功后将新建的任务返回到前端，然后赋值给
                        var returnData = reply.data[0];
                        for (i = 0; i < organizations.length; i++) {
                            if (organizations[i].organizationId == data.field.org) {
                                returnData.organizationName = organizations[i].organizationName;
                                returnData.userName = "你自己";
                                returnData.createTime = "刚刚";
                            }
                        }
                        parent.window.addNewTask(returnData);
                        var tip = "创建成功";
                        parent.layer.msg(tip, {shade: 0.3, time: 700});
                        parent.layer.close(index);//关闭窗口
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

    var organizations = getOrganizations();

    var orgVue = new Vue({
        el: "#organization",
        data: {
            items: organizations
        }
    });

    function getOrganizations() {
        var data;
        $.ajax({
            async: false,
            type: "post",
            url: "/org/admin/get",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code === 1) {
                    data = reply.data;
                }
            }
        });
        return data;
    }
});
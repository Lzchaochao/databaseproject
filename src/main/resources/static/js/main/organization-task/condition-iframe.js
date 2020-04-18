$(document).ready(function () {
    //orgId是从父页面传过来的参数，再调用函数获取成员列表
    var doCount = 0;
    var undoCount = 0;
    var tableData = getCondition(parent.window.workId);
    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table;
        var form = layui.form;
        table.render({
            id: 'dataTable',
            elem: '#table',
            toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                , layEvent: 'toolTip'
                , icon: 'layui-icon-tips'
            }],
            parseData: function (res) {     //res 即为原始返回的数据
                return {
                    "code": 1 - res.code,         //解析接口状态
                    "msg": res.msg,             //解析提示文本
                    "count": res.data.length,   //解析数据长度
                    "data": res.data            //解析数据列表
                };
            },
            title: '组织任务完成情况',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'userName',
                        title: '成员名称',
                        sort: true,
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.userName + '</div>'
                        }
                    },
                    {
                        field: 'userMail',
                        title: '成员邮箱',
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.userMail + '</div>'
                        }
                    },
                    {field: 'admin', title: '是否完成', sort: true, templet: '#switchTpl', width: 110, align: "center"},
                    {field: 'date', title: '完成时间', sort: true, width: 170, align: "center"}
                ]
            ],
            limits: [10],
            page: true,
            height: "full",
            data: tableData
        });

        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '组织创建者才拥有任免管理员的权限';
                //头部提示按钮
                layer.alert(tipStr, {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                });
            }
        });

    });

    //在此处从服务器获取该组织的成员列表
    function getCondition(workId) {
        var data;
        $.ajax({
            async: false,
            type: "post",
            url: "/task/admin/condition",
            data: {
                "litterWorkId": workId
            },
            dataType: "json",
            success: function (reply) {
                if (reply.code == 1) {
                    data = reply.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].date == null) {
                            undoCount++;
                        } else {
                            doCount++;
                        }
                    }
                }
                else {
                    layer.msg(reply.msg);
                }
            }, error: function (reply) {
                layer.msg("error");
            }
        });
        return data;
    }

    var per = Math.round(doCount * 100 / (doCount + undoCount));
    var titleTips = "完成率<b>" + per
        + "%</b>，应完成人数为" + (undoCount + doCount) + "，已完成" + doCount + "人，未完成" + undoCount + "人";
    $("#toolbarDemo").html("<div class=\"layui-word-aux\">" + titleTips + "</div>");
});
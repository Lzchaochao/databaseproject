$(document).ready(function () {
    layui.use(['table', 'form'], function () {
        var tableData = getMember(parent.window.orgId);
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
            title: '用户数据表',
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
                    {field: 'date', title: '加入时间', sort: true, width: 150, align: "center"},
                    {field: 'admin', title: '管理员', templet: '#switchTpl', width: 90, align: "center"},
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 120, align: "center"}
                ]
            ],
            limits: [10],
            page: true,
            height: "full",
            data: tableData
        });

        //开关监听事件 即切换是否是管理员
        form.on('switch(adminSelect)', function (obj) {
            //layer.msg(this.value + ' ' + this.name + '：' + obj.elem.checked);
            var idValue = this.value;
            $.ajax({
                async: false,
                type: "post",
                url: "/org/admin/setAdmin",
                data: {
                    "userId": idValue,
                    "orgId": parent.window.orgId,
                    "isAdmin": obj.elem.checked
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code == 1) {
                        //服务器返回实际更改后的check的true false 状态
                        obj.elem.checked = reply.data[0];
                        //将修改后的状态更新到数据数组
                        for (p = 0; p < tableData.length; p++) {
                            if (tableData[p].organizationId + "" == idValue) {
                                tableData[p].admin = reply.data[0];
                                break;
                            }
                        }
                    } else {
                        obj.elem.checked = !obj.elem.checked;
                        layer.msg(reply.msg);
                    }
                }, error: function (reply) {
                    layer.msg("error");
                }
            });
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

        table.on('tool(option)', function (obj) {
            var data = obj.data;
            if (obj.event === 'remove') {
                //移除组织的成员
                $.ajax({
                    async: false,
                    type: "post",
                    url: "/org/admin/remove",
                    data: {
                        "orgId": parent.window.orgId,
                        "userId": data.userId
                    },
                    dataType: "json",
                    success: function (reply) {
                        if (reply.code == 1) {
                            layer.msg("已移除");
                            obj.del();
                        }
                        else {
                            layer.msg(reply.msg);
                        }
                    }, error: function (reply) {
                        layer.msg("error");
                    }
                });
            } else if (obj.event === 'view') {
                parent.window.userId = data.userId;
                parent.layer.open({
                    type: 2,
                    area: ['700px', '600px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '查看<b>' + data.userName + '</b>的任务完成情况',
                    content: '/html/main/organization/report-iframe.html'
                });
            }
        });

        //在此处从服务器获取该组织的成员列表
        function getMember(orgId) {
            var data;
            $.ajax({
                async: false,
                type: "post",
                url: "/org/admin/member",
                data: {
                    "orgId": orgId
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code == 1) {
                        data = reply.data;
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
    });
});
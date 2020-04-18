$(document).ready(function () {
    var tableData;
    getRequestData();
    var tableIns;   //表格实例
    layui.use(['table', 'form'], function () {
        var table = layui.table;
        var form = layui.form;
        tableIns = table.render({
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
            title: '未读申请',
            cols: [
                [
                    {type: 'numbers'},
                    {field: 'userName', title: '用户名', sort: true},
                    {field: 'userMail', title: '用户邮箱', sort: true},
                    {
                        field: 'organizationName',
                        title: '组织名称',
                        sort: true,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.organizationName + '</div>'
                        }
                    },
                    {
                        field: 'requestDate',
                        title: '申请时间',
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.requestDate + '</div>'
                        }
                    },
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 120, align: "center"}
                ]
            ],
            initSort: {
                field: 'requestDate',
                type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            },
            limits: [10],
            page: true,
            height: "full",
            data: tableData
        });

        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '随便看看吧';
                //头部提示按钮
                layer.alert(tipStr, {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                });
            }
        });

        //监听行工具事件
        table.on('tool(option)', function (obj) {
            var data = obj.data;
            if (obj.event === 'agree') {
                $.ajax({
                    async: false,
                    type: "post",
                    url: "/req/done",
                    data: {
                        "reqId": data.joinRequestId,
                        "agree": true
                    },
                    dataType: "json",
                    success: function (reply) {
                        if (reply.code === 1) {
                            removeDoneData(data.joinRequestId);
                            layer.msg("已同意");
                        } else {
                            layer.msg(reply.msg);
                        }
                    }, error: function (reply) {
                        layer.msg("error");
                    }
                });
            } else if (obj.event === 'refuse') {
                var str = '确认要拒绝 ' + data.userName + ' 加入 ' + data.organizationName + ' 吗？';
                layer.confirm(str, function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/req/done",
                        data: {
                            "reqId": data.joinRequestId,
                            "agree": false
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code === 1) {
                                removeDoneData(data.joinRequestId);
                                layer.close(index);
                                layer.msg("已拒绝");
                            }
                            else {
                                layer.msg(reply.msg);
                            }
                        }, error: function (reply) {
                            layer.msg("error");
                        }
                    });
                });
            }
        });
    });

    /**
     * 同意或拒绝都会删除掉操作的那一行数据
     * 同时修改父页面（即左侧菜单）的通知的数量
     */
    function removeDoneData(joinRequestId) {
        for (k = 0; k < tableData.length; k++) {
            if (tableData[k].joinRequestId === joinRequestId) {
                tableData.splice(k, 1);
                break;
            }
        }
        reloadDataTable(tableData);
        parent.window.tipsVue.count--;
    }

    //传入数据更新数据列表
    function reloadDataTable(freshData) {
        tableIns.reload({
            data: freshData
            , page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }


    /**
     * 从服务器获取信息
     */
    function getRequestData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/req/get-undo",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code == 1) {
                    tableData = reply.data;
                }
            }
        });
    }
});
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
            title: '我的申请',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'organizationName',
                        title: '组织名称',
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.organizationName + '</div>'
                        }
                    },
                    {
                        field: 'description',
                        title: '组织描述',
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.description + '</div>'
                        }
                    },
                    {field: 'inviteCode', title: '组织邀请码', width: 120, align: "center"},
                    {field: 'requestDate', title: '申请时间', width: 150, sort: true, align: "center"},
                    {field: 'doneDate', title: '处理时间', width: 150, sort: true, align: "center"},
                    {
                        field: 'allow',
                        title: '是否通过',
                        width: 120,
                        sort: true,
                        align: "center",
                        templet: function (d) {
                            if (typeof d.allow == 'string') {
                                return d.allow
                            }
                            return d.allow ? '是' : '否'
                        }
                    },
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 180, align: "center"}
                ]
            ],
            initSort: {
                field: 'requestDate',
                type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
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
            if (obj.event === 'cancel') {
                //已经处理过的话就不处理点击事件
                if (data.done) {
                    return false;
                }
                layer.confirm('确认要取消加入 ' + data.organizationName + ' 吗', function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/req/cancel",
                        data: {
                            "reqId": data.joinRequestId,
                            "orgId": data.organizationId
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code == 1) {
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].joinRequestId == data.joinRequestId) {
                                        tableData[k].done = true;
                                        tableData[k].allow = '已取消';
                                        tableData[k].doneDate = '刚刚';
                                        break;
                                    }
                                }
                                reloadDataTable(tableData);
                                layer.msg("已取消");
                            }
                            else {
                                layer.msg(reply.msg);
                            }
                        }, error: function (reply) {
                            layer.msg("error");
                        }
                    });
                });
            } else if (obj.event === 'delete') {
                var str = '确认要删除此条记录吗？';
                if (!data.done) {
                    str += '将同时取消申请加入 ' + data.organizationName + ' ';
                }
                layer.confirm(str, function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/req/delete",
                        data: {
                            "reqId": data.joinRequestId
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code == 1) {
                                //将被删除的数据从tableData中移除
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].joinRequestId == data.joinRequestId) {
                                        tableData.splice(k, 1);
                                        break;
                                    }
                                }
                                reloadDataTable(tableData);
                                layer.close(index);
                                layer.msg("已删除");
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
     * 此处添加模糊搜索校验逻辑，将数据返回给数据重载对象
     * 采用正则表达式，全模糊搜索，支持断字
     */
    function getSearchData() {
        var info = $("#searchTitle").val();
        var str = ".*";
        //将搜索字符串拼接成正则表达式
        for (i = 0; i < info.length; i++) {
            str += info.charAt(i) + '.*';
        }
        var reg = new RegExp(str);
        var arr = [];
        for (var i = 0; i < tableData.length; i++) {
            if (reg.test(tableData[i].organizationName)) {
                arr.push(tableData[i]);
            }
        }
        return arr;
    }

    /**
     * 从服务器获取组织信息
     */
    function getRequestData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/req/get",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code == 1) {
                    tableData = reply.data;
                    for (p = 0; p < tableData.length; p++) {
                        if (!tableData[p].done) {
                            tableData[p].doneDate = '未处理';
                        }
                        if (tableData[p].doneAdminId == 0) {
                            tableData[p].allow = '已取消';
                        }
                    }
                }
            }
        });
    }
});
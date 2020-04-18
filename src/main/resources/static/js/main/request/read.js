$(document).ready(function () {
    var tableData;
    getRequestData();
    var tableIns;   //表格实例
    layui.use(['table', 'form', 'layer'], function () {
        var layer = layui.layer;
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
            title: '已读申请',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'userName',
                        title: '用户名',
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.userName + '</div>'
                        }
                    },
                    {
                        field: 'userMail',
                        title: '用户邮箱',
                        width: 200,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.userMail + '</div>'
                        }
                    },
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
                        field: 'doneAdminName',
                        title: '执行人',
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.doneAdminName + '</div>'
                        }
                    },
                    {field: 'requestDate', title: '申请时间', width: 150, align: "center", sort: true},
                    {field: 'doneDate', title: '处理时间', width: 150, align: "center", sort: true},

                    {
                        field: 'allow',
                        title: '是否通过',
                        width: 120,
                        sort: true,
                        align: "center",
                        templet:

                            function (d) {
                                return '<div style="text-align:left">' + d.allow ? '是' : '否' + '</div>'
                            }
                    }
                ]
            ],
            limits: [10],
            page: true,
            height: "full",
            data:
            tableData
        })
        ;

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
     * 从服务器获取信息
     */
    function getRequestData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/req/get-do",
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
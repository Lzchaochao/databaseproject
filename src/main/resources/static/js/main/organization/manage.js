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
            title: '我的组织',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'organizationName',
                        title: '组织名称',
                        sort: true,
                        width: 150,
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
                    {
                        field: 'ownerName',
                        title: '创建者',
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.ownerName + '</div>'
                        }
                    },
                    {
                        field: 'ownerMail',
                        title: '联系邮箱',
                        width: 170,
                        align: "center",
                        templet: function (res) {
                            return '<div style="text-align:left"><em>' + res.ownerMail + '</em></div>'
                        }
                    },
                    {
                        field: 'createTime', title: '创建时间',
                        sort: true,
                        width: 150,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.createTime + '</div>'
                        }
                    },
                    {field: 'inviteCode', title: '邀请码', width: 80},
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', align: "center", width: 190}
                ]
            ],
            initSort: {
                field: 'deadLine',
                type:
                    'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            },
            limits: [10],
            page: true,
            height: "full",
            data:
            tableData
        });

        //更改checkbox状态时也重新刷新一下查找列表
        form.on('checkbox', function (data) {
            reloadDataTable(getSearchData());
        });

        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '创建者可任免管理员、可解散组织、可移除其他管理员；管理员除上述权限外，和创建者享有其他一切管理权限';
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
            //查看组织的成员列表
            if (obj.event === 'member') {
                //将orgId设定为window参数，供子页面取用
                window.orgId = data.organizationId;
                layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '查看 ' + data.organizationName + " 的成员",
                    content: '/html/main/organization/member-iframe.html'
                });
            } else if (obj.event === 'dissolved') {
                var str = '不可撤销的操作，确认要解散 ' + data.organizationName + ' 吗？将同时移除所有成员及发布的任务';
                layer.confirm(str, function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/org/admin/close",
                        data: {
                            "orgId": data.organizationId
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code === 1) {
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].organizationId === data.organizationId) {
                                        tableData.splice(k, 1);
                                        break;
                                    }
                                }
                                reloadDataTable(tableData);
                                layer.close(index);
                                layer.msg("已解散");
                            }
                            else {
                                layer.msg(reply.msg);
                            }
                        }, error: function (reply) {
                            layer.msg("error");
                        }
                    });
                });
            } else if (obj.event === 'edit') {
                window.updateData = data;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['450px', '330px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '修改  ' + data.organizationName,
                    content: '/html/main/organization/org-edit-iframe.html'
                });
            }
        });

        $("#create").click(function () {
            layer.open({
                type: 2,
                area: ['500px', '340px'],
                fixed: true, //不固定
                //maxmin: true,
                title: '创建新组织',
                content: '/html/main/organization/create-iframe.html'
            });
            return false;
        });
    });

//搜索框每次输入时都调用标题搜索功能
    $("#searchTitle").on('input', function () {
        reloadDataTable(getSearchData());
    });

//按下ESC键时清空输入框
    $(document).keydown(function (event) {
        if (event.keyCode === 27) {
            $("#searchTitle").val("");
            reloadDataTable(getSearchData());
        }
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
            url: "/org/admin/get",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code === 1) {
                    tableData = reply.data;
                }
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
            if ($("#search-name").is(':checked') && reg.test(tableData[i].organizationName)) {
                arr.push(tableData[i]);
                continue;
            }
            if ($("#search-desc").is(':checked') && reg.test(tableData[i].description)) {
                arr.push(tableData[i]);
            }
        }
        return arr;
    }

    /**
     * 子页面修改后的数据传到这里
     * 将修改后的数据赋值到组织列表
     */
    window.setUpdateDataFromIFrame = function setUpdateDataFromIFrame(reData) {
        for (k = 0; k < tableData.length; k++) {
            if (tableData[k].organizationId === reData.organizationId) {
                tableData[k] = reData;
                break;
            }
        }
        //重新渲染数据表格
        reloadDataTable(tableData);
    };

    window.addCreateOrganization = function addCreateOrganization(data) {
        tableData.push(data);
        reloadDataTable(tableData);
    }
});
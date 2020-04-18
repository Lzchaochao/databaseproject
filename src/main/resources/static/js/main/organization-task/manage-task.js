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
            title: '组织任务',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'title',
                        title: '任务标题',
                        width: 200,
                        sort: true,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.title + '</div>'
                        }
                    },
                    {
                        field: 'description',
                        title: '任务描述',
                        sort: true,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.description + '</div>'
                        }
                    },
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
                        field: 'userName',
                        title: '创建者',
                        width: 150,
                        align: "center", sort: true,
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.userName + '</div>'
                        }
                    },
                    {field: 'createTime', title: '创建时间', width: 150, sort: true, align: "center"},
                    {
                        field: 'deadLine', title: '截止时间', width: 150, sort: true, align: "center",
                        templet: function (d) {
                            return (d.before ? '<div style="text-align:left; color:#FF5722">' : '<div style="text-align:left">') + d.deadLine + '</div>'
                        }
                    },
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 200, align: "center"}
                ]
            ],
            initSort: false,
            limits: [10],
            page: true,
            height: "full",
            data: getSearchData()
        });

        //更改checkbox状态时也重新刷新一下查找列表
        form.on('checkbox', function (data) {
            reloadDataTable();
        });

        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '无法修改已经截止的任务';
                //头部提示按钮
                layer.alert(tipStr, {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                });
            }
        });

        table.on('sort(option)', function (obj) { //注：sort 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            if (obj.type === 'asc') { //升序
                tableData = layui.sort(tableData, obj.field);
            } else if (obj.type === 'desc') { //降序
                tableData = layui.sort(tableData, obj.field, true);
            } else { //清除排序
                tableData = layui.sort(tableData, Object.keys(tableData[0])[0]);
            }
            reloadDataTable();
        });

        //监听行工具事件
        table.on('tool(option)', function (obj) {
            var data = obj.data;
            //查看组织的成员列表
            if (obj.event === 'situation') {
                window.workId = data.organizationWorkId;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['700px', '600px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '查看<b>' + data.title + '</b>的完成情况',
                    content: '/html/main/organization-task/condition-iframe.html'
                });
            } else if (obj.event === 'delete') {
                var str = '不可撤销的操作，确认要删除任务 ' + data.title + ' 吗？';
                layer.confirm(str, function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/task/admin/delete",
                        data: {
                            "workId": data.organizationWorkId
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code == 1) {
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].organizationWorkId == data.organizationWorkId) {
                                        tableData.splice(k, 1);
                                        break;
                                    }
                                }
                                reloadDataTable();
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
            } else if (obj.event === 'edit') {
                if (data.before) {
                    return;
                }
                window.updateData = data;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['600px', '500px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '修改  ' + data.title,
                    content: '/html/main/organization-task/work-edit-iframe.html'
                });
            }
        });

        $("#addTask").click(function () {
            layer.open({
                type: 2,
                area: ['500px', '500px'],
                fixed: true, //不固定
                //maxmin: true,
                title: '创建组织任务',
                content: '/html/main/organization-task/add-iframe.html'
            });
            return false;
        });
    });

    //搜索框每次输入时都调用标题搜索功能
    $("#searchTitle").on('input', function () {
        reloadDataTable();
    });

    //按下ESC键时清空输入框
    $(document).keydown(function (event) {
        if (event.keyCode === 27) {
            $("#searchTitle").val("");
            reloadDataTable();
        }
    });

    //传入数据更新数据列表
    function reloadDataTable() {
        tableIns.reload({
            data: getSearchData()
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
            url: "/task/admin/get",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code == 1) {
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
            if (!$("#search-before").is(':checked') && tableData[i].before) {
                continue;
            }
            var checkStr = "";
            if ($("#search-title").is(':checked')) {
                checkStr += tableData[i].title;
            }
            if ($("#search-desc").is(':checked')) {
                checkStr += tableData[i].description;
            }
            if ($("#search-org").is(':checked')) {
                checkStr += tableData[i].organizationName;
            }
            if (reg.test(checkStr)) {
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
        //去掉ddl的秒数
        reData.deadLine = reData.deadLine.substring(0, reData.deadLine.length - 3);
        for (k = 0; k < tableData.length; k++) {
            if (tableData[k].organizationWorkId === reData.organizationWorkId) {
                tableData[k] = reData;
                break;
            }
        }
        //重新渲染数据表格
        reloadDataTable();
    };

    window.addNewTask = function addNewTask(data) {
        tableData.push(data);
        reloadDataTable();
    }
});
$(document).ready(function () {
    var tableData;
    getOrganizationData();
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
            title: '我加入的组织',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'organizationName', title: '组织名称', width: 200, align: "center", templet: function (d) {
                            return '<div style="text-align:left">' + d.organizationName + '</div>'
                        }
                    },
                    {
                        field: 'description', title: '组织介绍', align: "center", templet: function (d) {
                            return '<div style="text-align:left">' + d.description + '</div>'
                        }
                    },
                    {
                        field: 'userName', title: '创建人', width: 110, align: "center", templet: function (d) {
                            return '<div style="text-align:left">' + d.userName + '</div>'
                        }
                    },
                    {field: 'joinDate', title: '加入时间', width: 160, sort: true, align: "center"},
                    {field: 'inviteCode', title: '邀请代码', width: 110, align: "center"},
                    {field: 'unShow', title: '屏蔽任务', templet: '#switchTpl', width: 110, sort: true, align: "center"},
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 130, align: "center"}
                ]
            ],
            initSort: {
                field: 'joinDate'
                , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            },
            limits: [10],
            page: true,
            height: "full",
            data: tableData
        });

        //开关监听事件 即那个是否完成的按钮
        form.on('switch(doneSelect)', function (obj) {
            //layer.msg(this.value + ' ' + this.name + '：' + obj.elem.checked);
            var idValue = this.value;
            $.ajax({
                async: false,
                type: "post",
                url: "/org/person/unshow",
                data: {
                    "orgId": idValue,
                    "unShow": obj.elem.checked
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code == 1) {
                        //服务器返回实际更改后的check的true false 状态
                        obj.elem.checked = reply.data[0];
                        //将修改后的状态更新到数据数组
                        for (p = 0; p < tableData.length; p++) {
                            if (tableData[p].organizationId + "" == idValue) {
                                tableData[p].unShow = reply.data[0];
                                break;
                            }
                        }
                    } else {
                        layer.msg(reply.msg);
                    }
                }, error: function (reply) {
                    layer.msg("error");
                }
            });
        });

        //更改checkbox状态时也重新刷新一下查找列表
        form.on('checkbox', function (data) {
            reloadDataTable(getSearchData());
        });

        //头工具栏事件，即模糊搜索事件标题
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
            if (obj.event === 'exit') {
                layer.confirm('确认要退出 ' + data.organizationName + ' 吗', function (index) {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/org/person/exit",
                        data: {
                            "orgId": data.organizationId
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code == 1) {
                                //将被删除的数据从tableData中移除
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].organizationId == data.organizationId) {
                                        tableData.splice(k, 1);
                                        break;
                                    }
                                }
                                reloadDataTable(tableData);
                                layer.close(index);
                                layer.msg("已退出");
                            }
                            else {
                                layer.msg(reply.msg);
                            }
                        }, error: function (reply) {
                            layer.msg("error");
                        }
                    });
                });
            } else if (obj.event === 'mission') {
                //查看任务
                window.updateData = data.works;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['700px', '450px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '查看 ' + data.organizationName + " 的发布任务",
                    content: '/html/main/organization/task-iframe.html'
                });
            }
        });

        $("#joinBtn").click(function () {
            layer.open({
                type: 2,
                area: ['500px', '400px'],
                fixed: true, //不固定
                //maxmin: true,
                title: '搜索新组织',
                content: '/html/main/organization/join-iframe.html'
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
            var checkStr = "";
            if ($("#search-name").is(':checked')) {
                checkStr += tableData[i].organizationName;
            }
            if ($("#search-desc").is(':checked')) {
                checkStr += tableData[i].description;
            }
            if ($("#search-owner").is(':checked')) {
                checkStr += tableData[i].userName;
            }
            if (reg.test(checkStr)) {
                arr.push(tableData[i]);
            }
        }
        return arr;
    }

    /**
     * 从服务器获取组织信息
     */
    function getOrganizationData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/org/person/get",
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
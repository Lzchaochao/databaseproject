$(document).ready(function () {
    var tableData;
    getOrganizationWorkData();
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
            title: '我的组织任务',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'title',
                        title: '任务标题',
                        align: "center",
                        sort: true,
                        width: 200,
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
                        title: '发布组织',
                        sort: true,
                        width: 200,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.organizationName + '</div>'
                        }
                    },
                    {
                        field: 'deadLine', title: '截止时间', width: 150, align: "center", sort: true,
                        templet: function (d) {
                            return (d.before ? '<div style="text-align:left; color:#FF5722">' : '<div style="text-align:left">') + d.deadLine + '</div>'
                        }
                    },
                    {field: 'createTime', title: '发布时间', width: 150, align: "center", sort: true},
                    {field: 'done', title: '是否完成', templet: '#switchTpl', width: 120, align: "center", sort: true}
                ]
            ],
            initSort: false,
            limits: [10],
            page: true,
            height: "full",
            data: getSearchData()
        });

        //开关监听事件 即那个是否完成的按钮
        form.on('switch(doneSelect)', function (obj) {
            //layer.msg(this.value + ' ' + this.name + '：' + obj.elem.checked);
            var idValue = this.value;
            console.log(tableData);
            console.log(idValue);
            $.ajax({
                async: false,
                type: "post",
                url: "/task/org/done",
                data: {
                    "workId": idValue,
                    "done": obj.elem.checked
                },
                dataType: "json",
                success: function (reply) {
                    if (reply.code == 1) {
                        //服务器返回实际更改后的check的true false 状态
                        obj.elem.checked = reply.data[0];
                        //将修改后的状态更新到数据数组
                        for (p = 0; p < tableData.length; p++) {
                            if (tableData[p].litterId + "" == idValue) {
                                tableData[p].done = reply.data[0];
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
            reloadDataTable();
        });

        //头工具栏事件，即模糊搜索事件标题
        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '无法将已经过期的任务标记为完成';
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
            if (!$("#search-done").is(':checked') && tableData[i].done) {
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
     * 从服务器获取组织信息
     */
    function getOrganizationWorkData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/task/org/get",
            data: {},
            dataType: "json",
            success: function (reply) {
                if (reply.code === 1) {
                    tableData = reply.data;
                }
            }
        });
    }
});
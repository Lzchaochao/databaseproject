$(document).ready(function () {
    var tableData;  //用户的任务列表
    getAllUserData();
    var tableIns;   //表格实例
    layui.use(['table', 'form'], function () {
        var table = layui.table;
        var form = layui.form;
        tableIns = table.render({
            id: 'dataTable',
            elem: '#table',
            // toolbar: '#toolbarDemo', //开启头部工具栏，并为其绑定左侧模板
            // defaultToolbar: ['filter', 'exports', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
            //     title: '提示'
            //     , layEvent: 'toolTip'
            //     , icon: 'layui-icon-tips'
            // }],
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 1 - res.code,       //解析接口状态
                    "msg": res.msg,             //解析提示文本
                    "count": res.data.length,   //解析数据长度
                    "data": res.data            //解析数据列表
                };
            },
            title: '我的任务',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'workNum',
                        title: '账户id',
                        align: "center",
                        sort: true,
                        width: 150,
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.workNum + '</div>'
                        }
                    },
                    {
                        field: 'worksName',
                        title: '员工姓名',
                        align: "center",
                        sort: true,
                        width: 180,
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.worksName + '</div>'
                        }
                    },
                    {field: 'worksSex', title: '员工性别', width: 100, sort: true, align: "center"},
                    {field: 'workPwd', title: '登录密码', width: 180, sort: true, align: "center"},
                    {
                        field: 'workFromWhen', title: '入职时间', width: 180, sort: true, align: "center",
                        templet: function (d) {
                            return (d.before ? '<div style="text-align:left; color:#FF5722">' : '<div style="text-align:left">') + d.workFromWhen + '</div>'
                        }
                    },
                    {
                        field: 'workerFromWhere',
                        title: '住址',
                        sort: true,
                        align: "center"
                    },
                    {field: 'workState', title: '是否离职', templet: '#switchTpl', width: 110, sort: true, align: "center"},
                    {fixed: 'right', title: '执行操作', toolbar: '#optionsbar', width: 120, align: "center"}
                ]
            ],
            limits: [10],
            autoSort: false,
            page: true,
            height: "full",
            data: getSearchData()
        });

        //开关监听事件 即那个是否完成的按钮
        // form.on('switch(doneSelect)', function (obj) {
        //     //layer.msg(this.value + ' ' + this.name + '：' + obj.elem.checked);
        //     var idValue = this.value;
        //     $.ajax({
        //         async: false,
        //         type: "post",
        //         url: "/task/person/done",
        //         data: {
        //             "litterId": idValue,
        //             "done": obj.elem.checked
        //         },
        //         dataType: "json",
        //         success: function (reply) {
        //             if (reply.code == 1) {
        //                 //服务器返回实际更改后的check的true false 状态
        //                 obj.elem.checked = reply.data[0];
        //                 //将修改后的状态更新到数据数组
        //                 for (p = 0; p < tableData.length; p++) {
        //                     if (tableData[p].litterId + "" == idValue) {
        //                         tableData[p].done = reply.data[0];
        //                         break;
        //                     }
        //                 }
        //             } else {
        //                 layer.msg(reply.msg);
        //             }
        //         }, error: function (reply) {
        //             layer.msg("error");
        //         }
        //     });
        // });

        //更改checkbox状态时也重新刷新一下查找列表
        form.on('checkbox', function (data) {
            reloadDataTable();
        });

        // table.on('toolbar(option)', function (obj) {
        //     if (obj.event === 'toolTip') {
        //         var tipStr = '无法修改已经到期的任务';
        //         //头部提示按钮
        //         layer.alert(tipStr, {
        //             skin: 'layui-layer-molv' //样式类名
        //             , closeBtn: 0
        //         });
        //     }
        // });

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

        //监听行工具事件，相应的事件
        table.on('tool(option)', function (obj) {
            var data = obj.data;    //object数据
            if (obj.event === 'edit') {
                if (data.before) {
                    return;
                }
                window.updateData = data;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['500px', '500px'],
                    fixed: false, //不固定
                    //maxmin: true,
                    title: '修改 ' + data.workName + ' 的基本信息',
                    content: '/html/admin/iframe/staff-update.html'
                });
            } else if (obj.event === 'delete') {
                layer.confirm('确认要删除该员工吗', function (index) {
                    //将删除操作更新到服务器
                    $.ajax({
                        async: false,
                        type: "post",
                        url: "/admin/staff/remove",
                        data: {
                            "workNum": data.workNum
                        },
                        dataType: "json",
                        success: function (reply) {
                            if (reply.code == 1) {
                                //将被删除的数据从tableData中移除
                                for (k = 0; k < tableData.length; k++) {
                                    if (tableData[k].workNum == data.workNum) {
                                        tableData.splice(k, 1);
                                        break;
                                    }
                                }
                                reloadDataTable();
                                layer.close(index);
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

        $("#addBtn").click(function () {
            layer.open({
                type: 2,
                area: ['500px', '500px'],
                fixed: true, //不固定
                //maxmin: true,
                title: '添加新员工',
                content: '/html/admin/iframe/staff-add.html'
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
            if (reg.test(tableData[i].workNum + tableData[i].worksName)) {
                arr.push(tableData[i]);
            }
        }
        return arr;
    }

    /**
     * 定义全局匿名函数，在修改任务的iframe子页面调用，用于返回修改后的data对象给此页面
     * 在此函数内将修改后的数据根据litterId更新到原数据组
     */
    // window.setUpdateDataFromIFrame = function setUpdateDataFromIFrame(reData) {
    //     reData.deadLine = reData.deadLine.substring(0, reData.deadLine.length - 3);
    //     for (k = 0; k < tableData.length; k++) {
    //         if (tableData[k].workNum == reData.workNum) {
    //             tableData[k] = reData;
    //             break;
    //         }
    //     }
    //     //重新渲染数据表格
    //     reloadDataTable();
    // };
    //
    // window.addDataFromIFrame = function addDataFromIFrame(reData) {
    //     tableData.push(reData);
    //     //重新渲染数据表格
    //     reloadDataTable();
    // };


    /**
     * 从服务器获取任务信息
     * 后续添加上分页或其他校验信息
     * 比如过去了的任务不给查
     */
    function getAllUserData() {
        $.ajax({
            async: false,
            type: "post",
            url: "/admin/staff/account",
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
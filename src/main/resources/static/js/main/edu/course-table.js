$(document).ready(function () {
    var sections = ["1-2节", "3-4节", "5-6节", "7-8节", "9-10节", "11-13节"];
    var viewWeekDay = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    var tableData = getUserCourse();
    var weekend = false;    //判断周末是否有课，有和没有会产生两种课表大小表现
    var nowWeek = tableData.nowWeek;
    var updateTip = false;
    var form;
    var weekCount = tableData.weekCount;
    var viewType = "1";
    var tableIns;   //表格实例
    tableData = tableData.courses;
    window.childData = []; //子页面回传的数据

    layui.use(['table', 'form', 'layer'], function () {
        var table = layui.table;
        form = layui.form;
        refreshCourseData(tableData);
        form.on('select(viewType)', function (data) {
            viewType = data.value;
            if (viewType === "1") {
                //课表模式
                $("#tableBody").show();
                $("#weekSelectDiv").show();
                $("#editTable").hide();
            } else {
                //编辑模式
                $("#tableBody").hide();
                $("#weekSelectDiv").hide();
                $("#editTable").show();
            }
            refreshCourseData(getSearchData());
        });

        //切换查看的周次时触发的函数
        form.on('select(week)', function (data) {
            nowWeek = data.value;
            refreshCourseData(getSearchData());
        });

        //设置默认的周数，即当前周数
        form.val("form", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            "selectWeek": nowWeek + ""
        });

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
            title: '我的课表',
            cols: [
                [
                    {type: 'numbers'},
                    {
                        field: 'courseName',
                        title: '课程名称',
                        edit: 'text',
                        sort: true,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.courseName + '</div>'
                        }
                    },
                    {
                        field: 'teacherName',
                        title: '任课老师',
                        edit: 'text',
                        width: 110,
                        align: "center",
                        templet: function (d) {
                            return '<div style="text-align:left">' + d.teacherName + '</div>'
                        }
                    },
                    {
                        field: 'classRoom',
                        title: '上课课室',
                        edit: 'text',
                        width: 110,
                        align: "center"
                    },
                    {
                        field: 'weekday',
                        title: '上课时间',
                        event: 'weekday',
                        style: 'cursor: pointer;',
                        sort: true,
                        width: 110,
                        align: "center",
                        templet: function (d) {
                            return viewWeekDay[d.weekday]
                        }
                    },
                    {
                        field: 'startTime',
                        title: '上课节次',
                        width: 110,
                        sort: true,
                        event: 'time',
                        style: 'cursor: pointer;',
                        align: "center",
                        templet: function (d) {
                            return d.startTime + '-' + d.endTime
                        }
                    },
                    {
                        field: 'workWeeks',
                        title: '上课周次',
                        event: 'week',
                        style: 'cursor: pointer;',
                        sort: true,
                        align: "center"
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        toolbar: '#optionsbar',
                        width: 130,
                        align: "center"
                    }
                ]
            ],
            initSort: {
                field: 'weekday'
                , type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
            },
            height: "full",
            data: tableData
        });

        table.on('edit(option)', function (obj) {
            for (b = 0; b < tableData.length; b++) {
                if (tableData[b].courseId === obj.data.courseId) {
                    if (obj.field === "courseName") {
                        tableData[b].courseName = obj.value;
                    } else if (obj.field === "teacherName") {
                        tableData[b].teacherName = obj.value;
                    } else if (obj.field === "classRoom") {
                        tableData[b].classRoom = obj.value;
                    }
                }
            }
            updateDataTip();
        });

        //头工具栏事件，即模糊搜索事件标题
        table.on('toolbar(option)', function (obj) {
            if (obj.event === 'toolTip') {
                var tipStr = '点击相应单元格即可编辑相应信息';
                //头部提示按钮
                layer.alert(tipStr, {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                });
            } else if (obj.event === 'addBtn') {
                window.maxWeek = weekCount;
                layer.open({
                    type: 2,
                    area: ['550px', '620px'],
                    fixed: true, //不固定
                    //maxmin: true,
                    title: '添加课程',
                    content: '/html/main/edu/add-course.html'
                });
            } else if (obj.event === 'updateBtn') {
                $.ajax({
                    async: false,
                    type: "post",
                    url: "/edu/save",
                    contentType: "application/json;charset=utf8",
                    data: JSON.stringify({courses: tableData}),
                    dataType: "json", //回调函数接收数据的数据格式
                    success: function (msg) {
                        if (msg.code === 1) {
                            layer.msg("保存成功");
                        } else {
                            layer.msg(msg.msg);
                        }
                    },
                    error: function (msg) {
                        layer.msg('未知错误');
                    }
                });
            }
        });

        //监听行工具事件
        table.on('tool(option)', function (obj) {
            var data = obj.data;
            if (obj.event === 'delete') {
                layer.confirm('确认要删除课程 ' + data.courseName + ' 吗', function (index) {
                    for (w = 0; w < tableData.length; w++) {
                        if (tableData[w].courseId == data.courseId) {
                            tableData.splice(w, 1);
                            break;
                        }
                    }
                    refreshCourseData(tableData);
                    updateDataTip();
                    layer.close(index);
                });
            } else if (obj.event === 'edit') {
                window.childData = data;
                window.maxWeek = weekCount;
                layer.open({
                    type: 2,
                    area: ['550px', '620px'],
                    fixed: true, //不固定
                    title: '添加课程',
                    content: '/html/main/edu/edit-course.html'
                });
            } else if (obj.event === 'weekday') {
                //星期几
                window.weekday = data.weekday;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                layer.open({
                    type: 2,
                    area: ['350px', '200px'],
                    fixed: false, //不固定
                    btn: ['确定', '取消'],
                    title: '修改 ' + data.courseName + " 的上课日期",
                    content: '/html/main/edu/edit-day.html',
                    yes: function (index) {
                        for (w = 0; w < tableData.length; w++) {
                            if (tableData[w].courseId == data.courseId) {
                                tableData[w].weekday = parseInt(childData);
                                break;
                            }
                        }
                        refreshCourseData(tableData);
                        updateDataTip();
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'time') {
                //第几节课
                window.endTime = data.endTime;
                layer.open({
                    type: 2,
                    area: ['320px', '200px'],
                    fixed: false, //不固定
                    btn: ['确定', '取消'],
                    title: '修改 ' + data.courseName + " 的上课节次",
                    content: '/html/main/edu/edit-time.html',
                    yes: function (index) {
                        childData = parseInt(childData);
                        var start = childData - 1;
                        if (start === 12) {
                            start--;
                        }
                        for (w = 0; w < tableData.length; w++) {
                            if (tableData[w].courseId == data.courseId) {
                                tableData[w].startTime = start;
                                tableData[w].endTime = childData;
                                break;
                            }
                        }
                        refreshCourseData(tableData);
                        updateDataTip();
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'week') {
                //哪一周
                window.weeks = data.workWeeks;//定义全局updateData用于在子页面访问，直接用var 定义无法在iframe访问到
                window.maxWeek = weekCount;
                layer.open({
                    type: 2,
                    area: ['350px', '250px'],
                    fixed: false, //不固定
                    btn: ['确定', '取消'],
                    title: '修改 ' + data.courseName + " 的上课周次",
                    content: '/html/main/edu/edit-week.html',
                    yes: function (index) {
                        for (w = 0; w < tableData.length; w++) {
                            if (tableData[w].courseId == data.courseId) {
                                tableData[w].workWeeks = childData;
                                break;
                            }
                        }
                        refreshCourseData(tableData);
                        updateDataTip();
                        layer.close(index);
                    }
                });
            }
        });
    });

    //刷新周次选择器，一共有多少周
    var weekVue = new Vue({
        el: '#weeks',
        data: {
            weekCount: weekCount
        }
    });

    //构建课表结构的vue
    var tableVue = new Vue({
        el: '#tableBody',
        data: {
            sections: sections,
            weekend: weekend
        }
    });

    //判断课程周数里面是否包含某一周
    function ifListContainValue(list, val) {
        if (val === "0") {
            return true;
        }
        for (l = 0; l < list.length; l++) {
            if (list[l] == val) {
                return true;
            }
        }
        return false;
    }

    function updateDataTip() {
        if (!updateTip) {
            layer.msg("修改了课表信息后，记得点击左上角保存更改哦");
            updateTip = true;
        }
    }

    //刷新两张表的数据
    function refreshCourseData(data) {
        if (data == null) {
            return;
        }
        if (viewType === "1") {
            weekend = false;
            var tb = document.getElementById('tableBody');
            //先清空
            for (c = 1; c <= 6; c++) {
                for (l = 1; l <= 7; l++) {
                    var td = tb.rows[c].cells[l];
                    td.innerHTML = "";
                }
            }
            for (p = 0; p < data.length; p++) {
                var course = data[p];
                if (!ifListContainValue(course.workWeeks, nowWeek)) {
                    continue;
                }
                if (course.weekday === 6) {
                    weekend = true;
                }
                if (course.weekday === 7) {
                    weekend = true;
                }
                var title = course.courseName + "\n" + course.teacherName + "\n" + parseWeeksList(course.workWeeks) + course.classRoom;
                var td = tb.rows[(course.startTime + 1) / 2].cells[course.weekday];
                td.innerHTML = title;
            }
        } else {
            tableIns.reload({
                data: data
            });
        }
    }

    //将上课周数转化成合适的格式
    function parseWeeksList(list) {
        //如果指定某一周的话就不需要显示周数了
        if (nowWeek !== "0") {
            return "";
        }
        var str = "第";
        if (list.length === 0) {
            return "无上课时间";
        } else if (list.length === 1) {
            str += list[0];
        } else {
            for (j = 0, i = 0; i < list.length; i++) {
                str += list[i];
                for (j = i + 1; j < list.length; j++) {
                    if (list[j] === list[j - 1] + 1) {
                        continue;
                    }
                    break;
                }
                if (j !== i + 1) {
                    str += "-" + list[j - 1];
                }
                str += ",";
                i = j - 1;
            }
            str = str.substr(0, str.length - 1);
        }
        return str + "周\n";
    }

    $("#eduAccount").click(function () {
        layer.open({
            type: 2,
            area: ['280px', '230px'],
            fixed: false, //不固定
            title: '输入你的教务系统账号',
            content: '/html/main/edu/edu-account.html'
        });
        return false;
    });

    $("#updateCourseTable").click(function () {
        var updateTip = "将从教务系统获取最新的课表，之前做的修改都将被覆盖，是否确认更新";
        layer.confirm(updateTip, function (index) {
            layer.msg('等待教务系统响应', {
                icon: 16
                , shade: 0.01
            });
            $.ajax({
                async: true,
                type: "post",
                url: "/edu/update",
                contentType: "application/json;charset=utf8",
                data: JSON.stringify({courses: tableData}),
                dataType: "json", //回调函数接收数据的数据格式
                success: function (msg) {
                    if (msg.code === 1) {
                        tableData = msg.data[0];
                        nowWeek = tableData.nowWeek;
                        weekCount = tableData.weekCount;
                        tableData = tableData.courses;
                        //设置默认的周数，即当前周数
                        form.val("form", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                            "selectWeek": nowWeek + ""
                        });
                        $("#searchTitle").val("");
                        refreshCourseData(tableData);
                        layer.closeAll('loading');
                        layer.close(index);
                        layer.msg("更新成功");
                    } else {
                        layer.msg(msg.msg);
                    }
                },
                error: function (msg) {
                    layer.msg('未知错误');
                }
            });
        });
        return false;
    });

    //搜索框每次输入时都调用标题搜索功能
    $("#searchTitle").on('input', function () {
        refreshCourseData(getSearchData());
    });

    //按下ESC键时清空输入框
    $(document).keydown(function (event) {
        if (event.keyCode === 27) {
            $("#searchTitle").val("");
            refreshCourseData(tableData);
        }
    });

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
            if (reg.test(tableData[i].teacherName + tableData[i].courseName)) {
                arr.push(tableData[i]);
            }
        }
        return arr;
    }

    window.addCourse = function (data) {
        var maxId = 0;
        for (h = tableData.length - 1; h >= 0; h--) {
            if (tableData[h].courseId > maxId) {
                maxId = tableData[h].courseId;
            }
        }
        data.courseId = maxId + 1;
        tableData.push(data);
        refreshCourseData(tableData);
        updateDataTip();
    };

    window.updateCourse = function (data) {
        for (w = 0; w < tableData.length; w++) {
            if (tableData[w].courseId == data.courseId) {
                tableData[w] = data;
                break;
            }
        }
        refreshCourseData(tableData);
        updateDataTip();
    };

    //从服务器获取信息
    function getUserCourse() {
        var table = [];
        $.ajax({
            async: false,
            type: "post",
            url: "/edu/get",
            data: {},
            dataType: "json", //回调函数接收数据的数据格式
            success: function (msg) {
                if (msg.code === 1) {
                    table = msg.data[0];
                }
            }
        });
        return table;
    }
});

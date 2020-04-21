<
!DOCTYPE
doctype
html >
< html
lang = "zh" >

    < head >
    < meta
charset = "utf-8" >
    < title >
    工资管理系统
    < /title>
    < script
src = "/webjars/jquery/3.4.0/jquery.min.js" > < /script>
    < script
src = "/webjars/vue/2.6.10/dist/vue.min.js" > < /script>
    < link
href = "/webjars/layui/2.5.5/css/layui.css"
rel = "stylesheet" / >
    < script
src = "/webjars/layui/2.5.5/layui.js" > < /script>
    < script
src = "/js/function.js" > < /script>
    < /head>
    < body
class
= "layui-layout-body" >
    < div
class
= "layui-layout layui-layout-admin" >
    < div
class
= "layui-header" >
    < div
class
= "layui-logo"
style = "font-size: 30px" > < /div>
    < ul
class
= "layui-nav layui-layout-right" >
    < li
class
= "layui-nav-item"
style = "width: 96px" >
    < a
href = "javascript:;"
id = "username"
style = "text-overflow: ellipsis;white-space: nowrap;overflow: hidden;text-align: center" >
    {
{
    name
}
}
<
/a>
< dl
class
= "layui-nav-child" >
    < dd > < a
href = "/user" > 账户设置 < /a></
dd >
< dd > < a
href = "javascript:;"
id = "doLogout" > 退出登录 < /a></
dd >
< /dl>
< /li>
< /ul>
< /div>
< div
class
= "layui-side layui-bg-black" >
    < div
class
= "layui-side-scroll" >
    < !--左侧导航区域（可配合layui已有的垂直导航） -- >
< ul
class
= "layui-nav layui-nav-tree" >
    < li
class
= "layui-nav-item layui-nav-itemed" >
    < a
href = "javascript:;" > 员工管理 < /a>
    < dl
class
= "layui-nav-child" >
    < dd > < a
href = "javascript:;"
class
= "layui-this"
onclick = "changeFrame('staff-account.html')" > 账号信息管理 < /a></
dd >
< dd > < a
href = "javascript:;"
onclick = "changeFrame('staff-dpt.html')" > 部门工种管理 < /a></
dd >
< /dl>
< /li>
< li
class
= "layui-nav-item" >
    < a
href = "javascript:;" > 工资管理 < /a>
    < dl
class
= "layui-nav-child" >
    < dd > < a
href = "javascript:;"
onclick = "changeFrame('salary-base.html')" > 基本工资 < /a></
dd >
< dd > < a
href = "javascript:;"
onclick = "changeFrame('salary-year.html')" > 年终奖 < /a></
dd >
< /dl>
< /li>
< li
class
= "layui-nav-item" >
    < a
href = "javascript:;" > 部门工种 < /a>
    < dl
class
= "layui-nav-child" >
    < dd > < a
href = "javascript:;"
onclick = "changeFrame('work-department.html')" > 部门管理 < /a></
dd >
< dd > < a
href = "javascript:;"
onclick = "changeFrame('work-kind.html')" > 工种管理 < /a></
dd >
< /dl>
< /li>
< li
class
= "layui-nav-item" >
    < a
href = "javascript:;" > 考勤管理 < /a>
    < dl
class
= "layui-nav-child" >
    < dd > < a
href = "javascript:;"
onclick = "changeFrame('attend-setting.html')" > 基本设置 < /a></
dd >
< dd > < a
href = "javascript:;"
onclick = "changeFrame('attend-record.html')" > 考勤查看 < /a></
dd >
< /dl>
< /li>
< li
class
= "layui-nav-item" >
    < a
href = "javascript:;" > 加班管理 < /a>
    < dl
class
= "layui-nav-child" >
    < dd > < a
href = "javascript:;"
onclick = "changeFrame('overtime-setting.html')" > 基本设置 < /a></
dd >
< dd > < a
href = "javascript:;"
onclick = "changeFrame('overtime-record.html')" > 记录查看 < /a></
dd >
< /dl>
< /li>
< /ul>
< /div>
< /div>
< div
class
= "layui-body" >
    < !--内容主体区域-- >
    < iframe
id = "main-body"
src = "/html/admin/staff-account.html"
style = "padding:0px;margin:0px;border:0px; ;height: 100%;width: 100%;" > 内容主体区域
    < /iframe>
    < /div>
    < div
class
= "layui-footer"
id = "foot-tip"
style = "text-align: center; white-space:pre" > {
{
    tip
}
} <
a
    :href = "href" > {
{
    beian
}
}<
/a>
< /div>
< /div>
< /body>
< /html>
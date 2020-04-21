package dbproject.controller.admin;

import dbproject.dao.AdminDao;
import dbproject.po.Reply;
import dbproject.po.Staff;
import dbproject.util.ReplyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 员工管理对应的两个子页面的操作都在这
 */
@Controller
@RequestMapping("/admin/staff")
public class StaffController {
    @Autowired
    ReplyUtil replyUtil;
    @Autowired
    AdminDao adminDao;

    /**
     * 获取所有的员工的账户信息
     * 即 id 姓名 密码 入职时间 是否离职 住址等等其他不重要的信息
     * 不需要传参
     *
     * @return 返回全部的普通用户list 封装在successList中返回
     */
    @ResponseBody
    @RequestMapping("/account")
    public Reply getAllStaffAccount() {


        List<Staff> list = adminDao.getAllStaffInformation();   //从数据库查出的list
        System.out.println(list.get(0));
        return replyUtil.success(list);
    }

    /**
     * 获取所有员工的部门工种信息
     * 即id 姓名 部门 工种 等级
     *
     * @return 返回全部的普通用户list 封装在successList中返回
     */
    @ResponseBody
    @RequestMapping("/dpt")
    public Reply getAllStaffDepartment() {

        List<Staff> list = new ArrayList<>();   //从数据库查出的list
        list.add(new Staff());  //这里add是为了方便我测试而已
        return replyUtil.success(list);
    }

    /**
     * 删除某个用户，将用户的基本信息记录从数据库删除
     *
     * @param workNum 要删除的用户的id
     * @return 删除成功返回success 错误返回error
     */
    @ResponseBody
    @RequestMapping("/remove")
    public Reply updateStaffInformation(String workNum) {
        boolean done = true;
        if (done) {
            return replyUtil.success();
        } else {
            return replyUtil.errorMessage("出现未知错误");
        }
    }

    /**
     * 向系统添加新员工
     *
     * @param staff 添加的信息封装到Staff类中,有姓名，密码，籍贯
     *              需要由系统生成workNum和入职时间（当前）
     * @return 删除成功返回success 错误返回error
     */
    @ResponseBody
    @RequestMapping("/add")
    public Reply addStaff(Staff staff) {
        System.out.println(staff);

        boolean done = true;
        if (done) {
            return replyUtil.success();
        } else {
            return replyUtil.errorMessage("出现未知错误，添加失败");
        }
    }

    /**
     * 修改用户的基本信息
     * 入职时间之类的信息
     *
     * @param staff 修改的信息封装到Staff中，包括workNum，即以workNum为主键修改其他信息
     * @return 成功返回success 错误返回error
     */
    @ResponseBody
    @RequestMapping("/update/info")
    public Reply updateStaffInformation(Staff staff) {
        System.out.println(staff);
        return replyUtil.success();
    }

    /**
     * 修改用户的岗位信息
     * 即工种 登记 部门
     *
     * @param staff 修改的信息封装到Staff中，包括workNum，即以workNum为主键修改其他信息
     * @return 成功返回success 错误返回error
     */
    @ResponseBody
    @RequestMapping("/update/dpt")
    public Reply updateStaffDepartment(Staff staff) {
        return replyUtil.success();
    }
}

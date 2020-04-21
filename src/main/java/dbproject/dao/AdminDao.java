package dbproject.dao;

import dbproject.po.Staff;

import java.util.List;

public interface AdminDao {
    /**
     * 获取所有用户的基本信息
     * id 姓名 密码 入职时间 是否离职 住址等等其他不重要的信息
     *
     * @return 返回list封装
     */
    public List<Staff> getAllStaffInformation();
}

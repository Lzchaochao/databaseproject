package dbproject.dao;
import java.util.Date;
import dbproject.po.Staff;
import dbproject.po.StaffDepartmentInformation;//实现StaffController接收结果创建的类
import java.util.List;

public interface AdminDao {
    /**
     * 获取所有用户的基本信息
     * id 姓名 密码 入职时间 是否离职 住址等等其他不重要的信息
     *
     * @return 返回list封装
     */
    public List<Staff> getAllStaffInformation();
    public List <StaffDepartmentInformation> getAllStaffDepartmentInformation();

    public boolean deleteOneBasicStaffInformation(int workNum);
    public boolean deleteAttdneceInformation(int workNum);
    public boolean deleteMonthSalaryInformation(int workNum);
    public boolean deleteOvertimeRecordInformation(int workNum);
    public boolean deleteYearEndInformation(int workNum);

    public boolean addOneStaffInformation( int WorkNum,Date WorkFromWhen,String WorkerFromWhere,String WorkPwd,int WorksDepartmentId,String WorksIdCard,int WorksLevel,String WorksName,String WorksSex,String WorkTypeId,boolean isWorkState);
}

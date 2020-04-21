package dbproject.po;

import java.util.Date;

/**
 * 工作部门对象
 * 对应work_department_table表
 */
public class Department {
    private int worksDepartmentId;
    private String worksDepartmentName;
    private Date setUpDate;

    public int getWorksDepartmentId() {
        return worksDepartmentId;
    }

    public void setWorksDepartmentId(int worksDepartmentId) {
        this.worksDepartmentId = worksDepartmentId;
    }

    public String getWorksDepartmentName() {
        return worksDepartmentName;
    }

    public void setWorksDepartmentName(String worksDepartmentName) {
        this.worksDepartmentName = worksDepartmentName;
    }

    public Date getSetUpDate() {
        return setUpDate;
    }

    public void setSetUpDate(Date setUpDate) {
        this.setUpDate = setUpDate;
    }
}

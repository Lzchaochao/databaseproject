package dbproject.po;

import java.util.Date;

/**
 * 工作部门对象
 * 对应work_department_table表
 */
public class Department {
    private String worksDepartmentId;
    private String worksDepartmentName;
    private Date setUpDate;

    public String getWorksDepartmentId() {
        return worksDepartmentId;
    }

    public void setWorksDepartmentId(String worksDepartmentId) {
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

package dbproject.po;

import java.util.Date;

/**
 * 员工表
 * 对应数据库的work_basic_table
 */
public class Staff {
    private String workNum;
    private int worksLevel;
    private String workTypeId;
    private String workerFromWhere;
    private Date workFromWhen;
    private String workPwd;
    private String worksName;
    private String worksSex;
    private String worksDepartmentId;
    private String worksIdCard;
    private boolean workState;

    public String getWorkNum() {
        return workNum;
    }

    public void setWorkNum(String workNum) {
        this.workNum = workNum;
    }

    public int getWorksLevel() {
        return worksLevel;
    }

    public void setWorksLevel(int worksLevel) {
        this.worksLevel = worksLevel;
    }

    public String getWorkTypeId() {
        return workTypeId;
    }

    public void setWorkTypeId(String workTypeId) {
        this.workTypeId = workTypeId;
    }

    public String getWorkerFromWhere() {
        return workerFromWhere;
    }

    public void setWorkerFromWhere(String workerFromWhere) {
        this.workerFromWhere = workerFromWhere;
    }

    public Date getWorkFromWhen() {
        return workFromWhen;
    }

    public void setWorkFromWhen(Date workFromWhen) {
        this.workFromWhen = workFromWhen;
    }

    public String getWorkPwd() {
        return workPwd;
    }

    public void setWorkPwd(String workPwd) {
        this.workPwd = workPwd;
    }

    public String getWorksName() {
        return worksName;
    }

    public void setWorksName(String worksName) {
        this.worksName = worksName;
    }

    public String getWorksSex() {
        return worksSex;
    }

    public void setWorksSex(String worksSex) {
        this.worksSex = worksSex;
    }

    public String getWorksDepartmentId() {
        return worksDepartmentId;
    }

    public void setWorksDepartmentId(String worksDepartmentId) {
        this.worksDepartmentId = worksDepartmentId;
    }

    public String getWorksIdCard() {
        return worksIdCard;
    }

    public void setWorksIdCard(String worksIdCard) {
        this.worksIdCard = worksIdCard;
    }

    public boolean isWorkState() {
        return workState;
    }

    public void setWorkState(boolean workState) {
        this.workState = workState;
    }
}

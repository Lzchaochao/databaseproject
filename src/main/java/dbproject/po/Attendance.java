package dbproject.po;

import java.util.Date;

/**
 * 考勤对象
 * 对应check_work_attendance_table表和work_kinds_table表，因为应用场景上两个需要一起
 */
public class Attendance {
    private String workNum;
    private Date theMonth;
    private int absenceTimes;
    private double basicMonthSalary;
    private String workTypeId;
    private int worksLevel;
    private String workKindName;
    private double absenceCutMoneyPerTime;

    public String getWorkNum() {
        return workNum;
    }

    public void setWorkNum(String workNum) {
        this.workNum = workNum;
    }

    public Date getTheMonth() {
        return theMonth;
    }

    public void setTheMonth(Date theMonth) {
        this.theMonth = theMonth;
    }

    public int getAbsenceTimes() {
        return absenceTimes;
    }

    public void setAbsenceTimes(int absenceTimes) {
        this.absenceTimes = absenceTimes;
    }

    public double getBasicMonthSalary() {
        return basicMonthSalary;
    }

    public void setBasicMonthSalary(double basicMonthSalary) {
        this.basicMonthSalary = basicMonthSalary;
    }

    public String getWorkTypeId() {
        return workTypeId;
    }

    public void setWorkTypeId(String workTypeId) {
        this.workTypeId = workTypeId;
    }

    public int getWorksLevel() {
        return worksLevel;
    }

    public void setWorksLevel(int worksLevel) {
        this.worksLevel = worksLevel;
    }

    public String getWorkKindName() {
        return workKindName;
    }

    public void setWorkKindName(String workKindName) {
        this.workKindName = workKindName;
    }

    public double getAbsenceCutMoneyPerTime() {
        return absenceCutMoneyPerTime;
    }

    public void setAbsenceCutMoneyPerTime(double absenceCutMoneyPerTime) {
        this.absenceCutMoneyPerTime = absenceCutMoneyPerTime;
    }
}

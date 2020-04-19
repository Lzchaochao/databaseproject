package dbproject.po;

import java.util.Date;

/**
 * 加班对象，用于封装加班记录信息
 * 对应work_overtime_record_table表，记录加班信息
 */
public class Overtime {
    private String recordId;
    private String theDate;
    private Date workNum;
    private double subWorkTime;
    private double subWorkKindId;
    private double subsidyMoney;

    public String getTheDate() {
        return theDate;
    }

    public void setTheDate(String theDate) {
        this.theDate = theDate;
    }

    public Date getWorkNum() {
        return workNum;
    }

    public void setWorkNum(Date workNum) {
        this.workNum = workNum;
    }

    public double getSubWorkTime() {
        return subWorkTime;
    }

    public void setSubWorkTime(double subWorkTime) {
        this.subWorkTime = subWorkTime;
    }

    public double getSubWorkKindId() {
        return subWorkKindId;
    }

    public void setSubWorkKindId(double subWorkKindId) {
        this.subWorkKindId = subWorkKindId;
    }

    public double getSubsidyMoney() {
        return subsidyMoney;
    }

    public void setSubsidyMoney(double subsidyMoney) {
        this.subsidyMoney = subsidyMoney;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }
}

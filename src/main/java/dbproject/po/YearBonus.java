package dbproject.po;

import java.util.Date;

/**
 * 年终奖类
 * 用于封装year_end_bonus_table表
 */
public class YearBonus {
    private String workNum;
    private Date theYear;
    private double sumOfMoney;
    //是否已经领取
    private boolean take;

    public String getWorkNum() {
        return workNum;
    }

    public void setWorkNum(String workNum) {
        this.workNum = workNum;
    }

    public Date getTheYear() {
        return theYear;
    }

    public void setTheYear(Date theYear) {
        this.theYear = theYear;
    }

    public double getSumOfMoney() {
        return sumOfMoney;
    }

    public void setSumOfMoney(double sumOfMoney) {
        this.sumOfMoney = sumOfMoney;
    }

    public boolean isTake() {
        return take;
    }

    public void setTake(boolean take) {
        this.take = take;
    }
}

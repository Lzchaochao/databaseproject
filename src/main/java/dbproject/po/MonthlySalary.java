package dbproject.po;

import java.util.Date;

/**
 * 月工资对象，用于封装月工资信息
 * 对应work_month_salary_table表
 * TODO 还没有完整的
 */
public class MonthlySalary {
    private String workNum;
    private Date theMonth;
    private double monthSalary;
    private double absenceCutMoney;

}

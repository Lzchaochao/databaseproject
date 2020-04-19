package dbproject.po;

/**
 * 基本加班信息，即加班的类型信息
 * 对应work_overtime_salary_table表 有别于Overtime对象
 */
public class OvertimeSalary {
    private int subWorkKindId;
    private double moneyPerHour;
    private String subWorkKindName;

    public int getSubWorkKindId() {
        return subWorkKindId;
    }

    public void setSubWorkKindId(int subWorkKindId) {
        this.subWorkKindId = subWorkKindId;
    }

    public double getMoneyPerHour() {
        return moneyPerHour;
    }

    public void setMoneyPerHour(double moneyPerHour) {
        this.moneyPerHour = moneyPerHour;
    }

    public String getSubWorkKindName() {
        return subWorkKindName;
    }

    public void setSubWorkKindName(String subWorkKindName) {
        this.subWorkKindName = subWorkKindName;
    }
}

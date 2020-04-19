package dbproject.po;

/**
 * 这个类用来封装登录信息
 * 用户登录的时候有两个属性，isAdmin和userID
 */
public class LoadInfomation {
    private boolean isAmin;
    private int workNum;

    public LoadInfomation() {
        isAmin = false;
        workNum = 0;
    }

    public LoadInfomation(boolean isAmin, int workNum) {
        this.isAmin = isAmin;
        this.workNum = workNum;
    }

    public boolean isAmin() {
        return isAmin;
    }

    public void setAmin(boolean amin) {
        isAmin = amin;
    }

    public int getWorkNum() {
        return workNum;
    }

    public void setWorkNum(int workNum) {
        this.workNum = workNum;
    }

    @Override
    public String toString() {
        return "LoadInfomation{" +
                "isAmin=" + isAmin +
                ", workNum=" + workNum +
                '}';
    }
}

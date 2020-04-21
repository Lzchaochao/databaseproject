package dbproject.po;

/**
 * 这个类用来封装登录信息
 * 用户登录的时候有两个属性，isAdmin和userID
 */
public class LoadInformation {
    private boolean isAmin;
    private String workNum;

    public LoadInformation() {
        isAmin = false;
        workNum = "";
    }

    public LoadInformation(boolean isAmin, String workNum) {
        this.isAmin = isAmin;
        this.workNum = workNum;
    }

    public boolean isAmin() {
        return isAmin;
    }

    public void setAmin(boolean amin) {
        isAmin = amin;
    }

    public void setWorkNum(String workNum) {
        this.workNum = workNum;
    }

    public String getWorkNum() {
        return workNum;
    }

    @Override
    public String toString() {
        return "LoadInformation{" +
                "isAmin=" + isAmin +
                ", workNum=" + workNum +
                '}';
    }
}

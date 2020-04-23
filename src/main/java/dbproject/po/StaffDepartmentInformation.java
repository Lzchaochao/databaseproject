package dbproject.po;

public class StaffDepartmentInformation {
    private int workNum;
    private String worksName;
    private String worksDepartmentName;
    private int worksLevel;
    private String workKindName;

    public  int getWorkNum() {
        return workNum;
    }

    public void setWorkNum(int workNum) {
        this.workNum = workNum;
    }

    public String getWorksName() {
        return worksName;
    }

    public void setWorksName(String worksName) {
        this.worksName = worksName;
    }

    public String getWorksDepartmentName() {
        return worksDepartmentName;
    }

    public void setWorksDepartmentName(String worksDepartmentName) {
        this.worksDepartmentName = worksDepartmentName;
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

    @Override
    public String toString() {
        return "StaffDepartmentInformation{" +
                "workNum='" + String.valueOf(workNum) + '\'' +
                ", worksName='" + worksName + '\'' +
                ", worksDepartmentName='" + worksDepartmentName + '\'' +
                ", worksLevel=" + String.valueOf(worksLevel) +
                ", workKindName='" + workKindName + '\'' +
                '}';
    }
}

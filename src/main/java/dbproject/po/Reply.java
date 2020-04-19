package dbproject.po;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

/**
 * 封装从服务器返回到客户端的信息
 * code表状态码，1为成功0为错误
 * msg是提示信息
 * list是封装的
 */
public class Reply {
    private int code;
    private String msg = "";
    private List data;

    public Reply() {

    }

    public Reply(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Reply(int code, List list) {
        this.code = code;
        this.data = list;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public List getData() {
        return data;
    }

    public void setData(List data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}

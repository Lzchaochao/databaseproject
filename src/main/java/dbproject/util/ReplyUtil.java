package dbproject.util;

import dbproject.po.Reply;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyUtil {
    private final int ERROR = 0;
    private final int SUCCESS = 1;
    private String defaultMsg = "未知错误";
    private Reply success = new Reply(SUCCESS, "操作成功");
    private Reply error = new Reply(ERROR, "未知错误");

    public Reply errorMessage(String msg) {
        return new Reply(ERROR, msg);
    }

    public Reply successList(List list) {
        return new Reply(SUCCESS, list);
    }

    public Reply success() {
        return success;
    }

    public Reply error() {
        return error;
    }
}

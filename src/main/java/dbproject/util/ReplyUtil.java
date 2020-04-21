package dbproject.util;

import dbproject.po.Reply;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReplyUtil {
    private final int ERROR = 0;
    private final int SUCCESS = 1;
    private String defaultMsg = "未知错误";
    private Reply success = new Reply(SUCCESS, "操作成功");
    private Reply error = new Reply(ERROR, "未知错误");
    private List<Object> defaultList = new ArrayList<>(1);

    public Reply errorMessage(String msg) {
        return new Reply(ERROR, msg);
    }

    /**
     * 正确并返回相关数据
     *
     * @param list 返回的是list的时候
     * @return
     */
    public Reply success(List list) {
        return new Reply(SUCCESS, list);
    }

    /**
     * 正确并返回相关数据
     *
     * @param obj 返回的只是单一对象即不是list的时候
     * @return
     */
    public Reply success(Object obj) {
        defaultList.clear();
        return new Reply(SUCCESS, defaultList);
    }

    /**
     * 默认的正确通知
     *
     * @return
     */
    public Reply success() {
        return success;
    }

    /**
     * 默认的错误通知
     *
     * @return
     */
    public Reply error() {
        return error;
    }
}

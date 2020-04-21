package dbproject.controller;

import dbproject.dao.LoginDao;
import dbproject.po.LoadInformation;
import dbproject.po.Reply;
import dbproject.util.ReplyUtil;
import dbproject.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    TokenUtil tokenUtil;
    @Autowired
    LoginDao loginDao;
    @Autowired
    ReplyUtil replyUtil;

    /**
     * 用户登录接口
     * 检查用户是否是普通用户，如果是的话查询正确应该返回工号
     * 如果不是普通用户的话检查下是否是管理员用户，如果是的话应该返回工号
     * 如果都不是那就说明账户密码错误
     *
     * @param account 登录账户
     * @param password     登录密码
     * @return 返回error表示账户密码错误，返回success表示登录成功
     */
    @ResponseBody
    @RequestMapping("/login")
    public Reply userLogin(HttpServletRequest request, HttpServletResponse response, String account, String password) {
        //查询是不是普通用户
        LoadInformation info = loginDao.isUser(account, password);
        if (info != null) {
            info.setAmin(false);
            response.addCookie(tokenUtil.setTokenToCookie(info.getWorkNum(), info.isAmin()));
            System.out.println(info);
            return replyUtil.success();
        }
        //这里要检查是不是管理员
        info = loginDao.isAdmin(account, password);
        if (info != null) {
            info.setAmin(true);
            response.addCookie(tokenUtil.setTokenToCookie(info.getWorkNum(), info.isAmin()));
            return replyUtil.success();
        }
        //如果都不是的话就提示密码错误
        return replyUtil.errorMessage("账户或密码错误");
    }

    /**
     * 用户退出登录接口
     * 删除相应cookie就行
     */
    @ResponseBody
    @RequestMapping("/logout")
    public Reply userLogout(HttpServletResponse response) {
        tokenUtil.deleteTokenFromCookie(response);
        return replyUtil.success();
    }
}

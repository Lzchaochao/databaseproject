package dbproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {
    /**
     * 管理员功能页面
     */
    @RequestMapping("/admin")
    public String adminLoginPage() {
        return "admin/main";
    }

    /**
     * 普通用户界面
     */
    @RequestMapping("/user")
    public String userLoginPage() {
        return "user/main";
    }

    /**
     * 登录界面
     * 管理员登录还是普通用户登录都在此界面
     * 跳转到管理员页面还是普通页面由逻辑层判断
     */
    @RequestMapping("/login")
    public String mainPage() {
        return "login/login";
    }
}

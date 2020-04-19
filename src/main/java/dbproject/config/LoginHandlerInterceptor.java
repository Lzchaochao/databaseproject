package dbproject.config;

import dbproject.po.LoadInformation;
import dbproject.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录请求拦截器处理逻辑类
 * 如果没有登录，访问的是登录接口则放行，否则重定向到登录接口
 * 如果已经登录，访问的不是登录接口则放行，否则重定向到用户模式
 * 已经登录的情况下还要放行登出接口
 */
@Component
public class LoginHandlerInterceptor implements HandlerInterceptor {
    @Autowired
    TokenUtil tokenUtil;

    /**
     * 登录的时候先做权限跳转
     * 首先判断有没有登录，没有的话跳转到登录接口
     * 其次判断其是不是管理员，如果是管理员则跳转到管理员界面，否则跳转到普通用户界面
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        LoadInformation info = tokenUtil.getLoadInfoFromCookies(request);
        String path = request.getRequestURI();
        String userUrl = "/user";
        String adminUrl = "/admin";
        String loginUrl = "/login";
        String logoutUrl = "/login/logout";

        //判断有没有登录，没有登录的话就跳转到登录界面
        if (info.getWorkNum() == 0) {
            if (path.startsWith(loginUrl)) {
                return true;
            }
            response.sendRedirect("/login");
            return false;
        }

        //登录后将其导向正确的界面，即管理员界面或用户界面
        if (path.startsWith(adminUrl)) {
            if (info.isAmin()) {
                return true;
            } else {
                response.sendRedirect(userUrl);
            }
        } else if (path.startsWith(userUrl)) {
            if (info.isAmin()) {
                response.sendRedirect(adminUrl);
            } else {
                return true;
            }
        }
        return path.equals(logoutUrl);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}

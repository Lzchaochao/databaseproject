package dbproject.config;

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

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        int userId = tokenUtil.getIdFromCookies(request);
        String path = request.getRequestURI();
        String loginUrl = "/login";
        String logoutUrl = "/login/logout";
//        System.out.println(userId);
//        System.out.println("path   -" + path + "-");
//        System.out.println("logi   -" + loginUrl + "-");
        //如果用户没有登录，只能访问登录相关接口
        if (userId == 0) {
            if (path.startsWith(loginUrl)) {
                return true;
            }
            response.sendRedirect("/login");
            return false;
        }
        //如果用户登录了，访问的不是登录接口或访问的是登出接口则放行
        if (!path.startsWith(loginUrl) || path.equals(logoutUrl)) {
            return true;
        }
        //如果用户登录了又要访问登录相关接口，则定向到用户模式
        response.sendRedirect("/main");
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}

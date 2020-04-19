package dbproject.dao;

import dbproject.po.LoadInfomation;

public interface LoginDao {
    /**
     * 检查登录的账户是否是普通账户
     *
     * @param account 账户，即工号
     * @param psw     登录密码
     * @return 返回int代表员工工号，如果没有相关记录的话返回应该是0
     */
    public LoadInfomation isUser(String account, String psw);
}

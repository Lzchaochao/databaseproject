package dbproject.dao;

import dbproject.po.LoadInformation;

public interface LoginDao {
    /**
     * 检查登录的账户是否是普通账户
     *
     * @param account 账户，即工号
     * @param psw     登录密码
     * @return 返回工号封装到LoadInformation类中，如果查询不到记录返回的是null
     * 注意这里不能直接返回int，如果是int的话当查询不到相关记录会报错
     */
    public LoadInformation isUser(String account, String psw);

    /**
     * 判断登录账户是否是管理员账户
     *
     * @param account 账户，即管理员工号
     * @param psw     登录密码
     * @return 返回工号封装到LoadInformation中
     */
    public LoadInformation isAdmin(String account, String psw);
}

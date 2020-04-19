package dbproject.config;

import com.alibaba.druid.filter.Filter;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import com.alibaba.druid.wall.WallConfig;
import com.alibaba.druid.wall.WallFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.*;

@Configuration
public class DruidConfig {
    private static final String DB_PREFIX = "spring.datasource";

    /**
     * Druid没有AutoConfig，使用此类将application.yml的属性绑定
     */
    @Bean
    @ConfigurationProperties(prefix = DB_PREFIX)
    public DataSource druid() {
        DruidDataSource druidDataSource = new DruidDataSource();
        List<Filter> filterList = new ArrayList<>();
        filterList.add(wallFilter());
        //这里将wallFilter add 给 list
        druidDataSource.setProxyFilters(filterList);
        return druidDataSource;
    }

    /**
     * 配置Druid的监控，管理后台的servlet
     */
    @Bean
    public ServletRegistrationBean statViewServlet() {
        ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
        Map<String, String> initParameters = new HashMap<>();
        initParameters.put("loginUsername", "ccc");
        initParameters.put("loginPassword", "lizhichao");
        initParameters.put("allow", "localhost");
        bean.setInitParameters(initParameters);
        return bean;
    }

    @Bean
    public FilterRegistrationBean webStatFilter() {
        FilterRegistrationBean filter = new FilterRegistrationBean();
        filter.setFilter(new WebStatFilter());
        Map<String, String> initParameters = new HashMap<>();
        initParameters.put("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        filter.setInitParameters(initParameters);
        filter.setUrlPatterns(Arrays.asList("/*"));
        return filter;
    }

    //这个是防火墙，开启druid的多SQL功能
    @Bean
    public WallFilter wallFilter() {
        WallFilter wallFilter = new WallFilter();
        wallFilter.setConfig(wallConfig());
        return wallFilter;
    }

    @Bean
    public WallConfig wallConfig() {
        WallConfig wallConfig = new WallConfig();
        //允许一次执行多条语句
        wallConfig.setMultiStatementAllow(true);
        wallConfig.setNoneBaseStatementAllow(true);
        return wallConfig;
    }

}

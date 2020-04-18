package dbproject;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@MapperScan("dbproject.dao")
@SpringBootApplication
@EnableScheduling
//设置开启定时任务
@EnableAsync
//设置开启多线程
public class DatabaseprojectApplication {
    /**
     * 设置时区为东八区
     */
    void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(DatabaseprojectApplication.class, args);
    }

}

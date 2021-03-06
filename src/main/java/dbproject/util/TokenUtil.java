package dbproject.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import dbproject.po.LoadInformation;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class TokenUtil {
    private final String SECRET_KEY = "databaseProject";
    private final long EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;
    private final int COOKIE_MAX_TIME = 7 * 24 * 60 * 60 * 1000;
    private final String NAME = "token";
    private Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
    private JWTVerifier verifier = JWT.require(algorithm).build();

    public String createToken(String id, boolean isAdmin) {
        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
        Map<String, Object> header = new HashMap<>(2);
        header.put("alg", "HS256");
        header.put("typ", "JWT");
        return JWT.create()
                .withHeader(header)
                .withClaim("id", id)
                .withClaim("admin", isAdmin)
                .withClaim("random", (new Random()).nextInt(65535))
                .withExpiresAt(date)
                .sign(algorithm);
    }

    public int verifyTokenId(String token) {
        try {
            DecodedJWT jwt = verifier.verify(token);
            return jwt.getClaim("id").asInt();
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 根据浏览器请求携带的cookie信息，解析出可能携带的info
     * 如果没有登录则返回o-false
     * 否则返回相应信息
     */
    public LoadInformation getLoadInfoFromCookies(HttpServletRequest request) {
        LoadInformation info = new LoadInformation();
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (NAME.equals(cookie.getName())) {
                    try {
                        DecodedJWT jwt = verifier.verify(cookie.getValue());
                        info.setWorkNum(jwt.getClaim("id").asString());
                        info.setAmin(jwt.getClaim("admin").asBoolean());
                        break;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return info;
    }

    public void deleteTokenFromCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(NAME, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public Cookie setTokenToCookie(String id, boolean isAdmin) {
        Cookie cookie = new Cookie(NAME, createToken(id, isAdmin));
        cookie.setPath("/");
        cookie.setMaxAge(COOKIE_MAX_TIME);
        cookie.setHttpOnly(true);
        return cookie;
    }
}

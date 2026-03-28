package com.lewis.disaster_relief_platform.auth.config.token;

import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.model.UserPrinciple;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class JWTUtilTest {

    private JWTUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JWTUtil();
        // Inject a test secret via ReflectionTestUtils (mirrors @Value injection)
        ReflectionTestUtils.setField(jwtUtil, "secret", "test-secret-key-that-is-long-enough-for-hmac512");
        jwtUtil.init();
    }

    private UserPrinciple buildUserPrinciple(Role role) {
        User user = User.builder()
                .id("user-001")
                .username("testuser")
                .password("encoded")
                .email("test@example.com")
                .role(Set.of(role))
                .enabled(true)
                .build();
        return new UserPrinciple(user);
    }

    // ─── generateJwtToken ─────────────────────────────────────────────────────────

    @Test
    void generateJwtToken_returnsNonBlankToken() {
        UserPrinciple userPrinciple = buildUserPrinciple(Role.VOLUNTEER);

        String token = jwtUtil.generateJwtToken(userPrinciple);

        assertThat(token).isNotBlank();
        // JWT tokens have three dot-separated segments
        assertThat(token.split("\\.")).hasSize(3);
    }

    // ─── getSubject ───────────────────────────────────────────────────────────────

    @Test
    void getSubject_returnsCorrectUsername() {
        UserPrinciple userPrinciple = buildUserPrinciple(Role.VOLUNTEER);
        String token = jwtUtil.generateJwtToken(userPrinciple);

        String subject = jwtUtil.getSubject(token);

        assertThat(subject).isEqualTo("testuser");
    }

    // ─── isTokenValid ──────────────────────────────────────────────────────────────

    @Test
    void isTokenValid_correctUsernameAndFreshToken_returnsTrue() {
        UserPrinciple userPrinciple = buildUserPrinciple(Role.VOLUNTEER);
        String token = jwtUtil.generateJwtToken(userPrinciple);

        boolean valid = jwtUtil.isTokenValid("testuser", token);

        assertThat(valid).isTrue();
    }

    @Test
    void isTokenValid_emptyUsername_returnsFalse() {
        UserPrinciple userPrinciple = buildUserPrinciple(Role.VOLUNTEER);
        String token = jwtUtil.generateJwtToken(userPrinciple);

        boolean valid = jwtUtil.isTokenValid("", token);

        assertThat(valid).isFalse();
    }

    // ─── getAuthorities ───────────────────────────────────────────────────────────

    @Test
    void getAuthorities_returnsRolePrefixedAuthority() {
        UserPrinciple userPrinciple = buildUserPrinciple(Role.ADMIN);
        String token = jwtUtil.generateJwtToken(userPrinciple);

        List<GrantedAuthority> authorities = jwtUtil.getAuthorities(token);

        assertThat(authorities).isNotEmpty();
        assertThat(authorities.stream().map(GrantedAuthority::getAuthority))
                .contains("ROLE_ADMIN");
    }
}

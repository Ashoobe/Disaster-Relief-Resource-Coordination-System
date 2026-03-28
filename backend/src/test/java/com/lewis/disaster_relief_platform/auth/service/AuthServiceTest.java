package com.lewis.disaster_relief_platform.auth.service;

import com.lewis.disaster_relief_platform.auth.config.constant.SecurityConstant;
import com.lewis.disaster_relief_platform.auth.config.token.JWTUtil;
import com.lewis.disaster_relief_platform.auth.dto.request.RegisterRequest;
import com.lewis.disaster_relief_platform.auth.dto.response.AuthResponse;
import com.lewis.disaster_relief_platform.auth.model.Role;
import com.lewis.disaster_relief_platform.auth.model.User;
import com.lewis.disaster_relief_platform.auth.repository.UserRepository;
import com.lewis.disaster_relief_platform.common.exception.domain.EmailAlreadyExistsException;
import com.lewis.disaster_relief_platform.common.exception.domain.InvalidCredentialsException;
import com.lewis.disaster_relief_platform.common.exception.domain.UserAlreadyExistsException;
import com.lewis.disaster_relief_platform.emergency.service.EmergencyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private EmergencyService emergencyService;

    @InjectMocks
    private AuthService authService;

    // ─── helpers ────────────────────────────────────────────────────────────────

    private RegisterRequest buildRegisterRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test User");
        req.setUsername("testuser");
        req.setEmail("test@example.com");
        req.setPassword("secret123");
        return req;
    }

    private User buildSavedUser() {
        return User.builder()
                .id("user-001")
                .fullName("Test User")
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$encodedSecret")
                .role(Set.of(Role.VOLUNTEER))
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // ─── register ────────────────────────────────────────────────────────────────

    @Test
    void register_newUser_returnsAuthResponse() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$10$encodedSecret");
        User savedUser = buildSavedUser();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateJwtToken(any())).thenReturn("mock.jwt.token");

        // Act
        AuthResponse response = authService.register(buildRegisterRequest());

        // Assert
        assertThat(response.getToken()).isEqualTo("mock.jwt.token");
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getType()).isEqualTo(SecurityConstant.TOKEN_PREFIX);
        // VOLUNTEER role is auto-assigned regardless of request
        assertThat(response.getRole()).contains(Role.VOLUNTEER);
        // Emergencies should be linked after registration
        verify(emergencyService).linkEmergenciesToUser(eq("user-001"), eq("test@example.com"));
    }

    @Test
    void register_duplicateUsername_throwsUserAlreadyExistsException() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(buildRegisterRequest()))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("testuser");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_duplicateEmail_throwsEmailAlreadyExistsException() {
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(buildRegisterRequest()))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("test@example.com");

        verify(userRepository, never()).save(any());
    }

    // ─── login ────────────────────────────────────────────────────────────────────

    @Test
    void login_existingUser_returnsAuthResponseAndUpdatesLastLogin() {
        User user = buildSavedUser();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateJwtToken(any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.login("testuser");

        assertThat(response.getToken()).isEqualTo("mock.jwt.token");
        assertThat(response.getUsername()).isEqualTo("testuser");
        // lastLoginAt must have been set before save
        assertThat(user.getLastLoginAt()).isNotNull();
        verify(userRepository).save(user);
    }

    @Test
    void login_unknownUser_throwsInvalidCredentialsException() {
        when(userRepository.findByUsername("nobody")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login("nobody"))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}

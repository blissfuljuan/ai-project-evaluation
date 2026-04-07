package com.blissfuljuan.aiprojectevaluation.service.auth;

import com.blissfuljuan.aiprojectevaluation.dto.auth.AuthResponse;
import com.blissfuljuan.aiprojectevaluation.dto.auth.LoginRequest;
import com.blissfuljuan.aiprojectevaluation.dto.auth.RegisterRequest;
import com.blissfuljuan.aiprojectevaluation.exception.BadRequestException;
import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.model.enumtype.Role;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import com.blissfuljuan.aiprojectevaluation.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstname("Eric");
        registerRequest.setLastname("Revilleza");
        registerRequest.setEmail("eric@email.com");
        registerRequest.setPassword("Password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("eric@email.com");
        loginRequest.setPassword("Password123");

        user = new User();
        user.setFirstname("Eric");
        user.setLastname("Revilleza");
        user.setEmail("eric@email.com");
        user.setPassword("encoded-password");
        user.setRole(Role.STUDENT);
        user.setActive(true);

        setUserId(user, 1L);
    }

    @Test
    void register_ShouldCreateUserAndReturnAuthResponse_WhenEmailNotExits() {
        when(userRepository.existsByEmail("eric@email.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class ))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            return savedUser;
        });
        when(jwtService.generateToken(1L, "eric@email.com", "STUDENT"))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUser()).isNotNull();
        assertThat(response.getUser().getEmail()).isEqualTo("eric@email.com");
        assertThat(response.getUser().getRole()).isEqualTo("STUDENT");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getFirstname()).isEqualTo("Eric");
        assertThat(savedUser.getLastname()).isEqualTo("Revilleza");
        assertThat(savedUser.getEmail()).isEqualTo("eric@email.com");
        assertThat(savedUser.getPassword()).isEqualTo("encoded-password");
        assertThat(savedUser.getRole()).isEqualTo(Role.STUDENT);
        assertThat(savedUser.isActive()).isTrue();

        verify(userRepository).existsByEmail("eric@email.com");
        verify(passwordEncoder).encode("Password123");
        verify(jwtService).generateToken(1L, "eric@email.com", "STUDENT");
    }

    @Test
    void register_ShouldThrowBadRequestException_WhenEmailAlreadyExists() {
        when(userRepository.existsByEmail("eric@email.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email is already registered");

        verify(userRepository).existsByEmail("eric@email.com");
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
        verify(jwtService, never()).generateToken(anyLong(), anyString(), anyString());
    }


    @Test
    void login_ShouldAuthenticateAndReturnAuthResponse_WhenCredentialsAreValid() {
        when(userRepository.findByEmail("eric@email.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(1L, "eric@email.com", "STUDENT"))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUser()).isNotNull();
        assertThat(response.getUser().getEmail()).isEqualTo("eric@email.com");
        assertThat(response.getUser().getRole()).isEqualTo("STUDENT");

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("eric@email.com");
        verify(jwtService).generateToken(1L, "eric@email.com", "STUDENT");
    }

    private void setUserId(User user, Long id) {
        try {
            Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to set user id for test.", ex);
        }
    }
}

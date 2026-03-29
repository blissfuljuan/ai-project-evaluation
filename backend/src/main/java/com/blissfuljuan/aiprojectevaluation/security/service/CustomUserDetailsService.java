package com.blissfuljuan.aiprojectevaluation.security.service;

import com.blissfuljuan.aiprojectevaluation.model.User;
import com.blissfuljuan.aiprojectevaluation.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email == null ? null : email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        return new CustomUserDetails(user);
    }
}

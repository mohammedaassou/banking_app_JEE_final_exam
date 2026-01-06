package ma.mundia.springbankingbackend.services;

import ma.mundia.springbankingbackend.dtos.AuthDtos.*;
import ma.mundia.springbankingbackend.entities.AppUser;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    MessageResponse changePassword(String username, ChangePasswordRequest request);
    UserInfo getCurrentUser(String username);
    AppUser findByUsername(String username);
}

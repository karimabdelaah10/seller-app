import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto, registerNewUserDto } from './dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('register')
  registerNewUser(@Body() createNewUserData: registerNewUserDto) {
    return this.authService.registerNewUser(createNewUserData);
  }
  @Post('login')
  loginUser(@Body() loginData: loginUserDto) {
    return this.authService.loginUser(loginData);
  }
}

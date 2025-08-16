import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { registerNewUserDto } from './dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserInterface } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async registerNewUser(createNewUserData: registerNewUserDto) {
    /*****
      1- validate that the user does not already exist ( by email or mobile )
      2-hash the password (if applicable)
      3- create the user in the database
      4- generate a JWT token for the user
      5- return the user data and token
     */
    const alreadyExistingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: createNewUserData.email },
          { mobile: createNewUserData.mobile },
        ],
      },
    });
    if (alreadyExistingUser) {
      throw new UnprocessableEntityException(
        'User already exists with this email or mobile number',
      );
    }
    const hashedPassword = await bcrypt.hash(createNewUserData.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        email: createNewUserData.email,
        password: hashedPassword, // Ensure to hash the password
        name: createNewUserData.name,
        mobile: createNewUserData.mobile,
      },
    });

    return {
      message: 'User registered successfully',
      userData: newUser,
      token: this.generateUserToken(newUser),
    };
  }

  async loginUser(loginCredential: { mobile: string; password: string }) {
    /***
      1- validate that the user exists by mobile number
      2- check if the password is correct
      3- generate a JWT token for the user
      4- return the user data and token
      ***/
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        mobile: loginCredential.mobile,
      },
    });
    if (!existingUser) {
      throw new UnprocessableEntityException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginCredential.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid password');
    }
    return {
      message: 'User logged in successfully',
      userData: existingUser,
      token: this.generateUserToken(existingUser),
    };
  }

  private generateUserToken(user: UserInterface): string {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        type: user.type,
      },
      process.env.JWT_TOKEN_KEY as string,
      { expiresIn: '1h' }, // Set token expiration time
    );
  }
}

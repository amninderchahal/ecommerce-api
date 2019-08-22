import { IsEmail, MinLength, IsDefined } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginRequest {
    @IsEmail() 
    @ApiModelProperty()
    readonly email: string;

    @MinLength(6)
    @ApiModelProperty()
    readonly password: string;
}

export class ResetPasswordRequest {
    @IsDefined()
    @ApiModelProperty()
    readonly resetToken: string;

    @MinLength(6)
    @ApiModelProperty()
    readonly newPassword: string;
}

export class TokenValidateRequest {
    @IsDefined()
    @ApiModelProperty()
    readonly token: string;
}

export class ForgotPasswordRequest {
    @IsDefined()
    @ApiModelProperty()
    readonly email: string;
}
import { IsEmail, MinLength, IsDefined } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class AddUserRequest {
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @IsDefined()
    @ApiModelProperty()
    readonly firstName: string;

    @IsDefined()
    @ApiModelProperty()
    readonly lastName: string;

    @IsDefined()
    @ApiModelProperty()
    readonly phoneNumber: string;

    @MinLength(6)
    @ApiModelProperty()
    readonly password: string;

    @IsDefined()
    @ApiModelProperty()
    readonly tags: string[];

    @IsDefined()
    @ApiModelProperty()
    readonly filters: string[];
}

export class ConfirmEmailRequest {
    @IsDefined()
    @ApiModelProperty()
    readonly ct: string;
}
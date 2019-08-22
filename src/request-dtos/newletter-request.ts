import { IsEmail, IsDefined  } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SubscribeUser {
    @IsDefined() 
    @ApiModelProperty()
    readonly firstName: string;

    @IsDefined() 
    @ApiModelProperty()
    readonly lastName: string;

    @IsEmail() 
    @ApiModelProperty()
    readonly email: string;
}
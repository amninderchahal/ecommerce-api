import { IsDefined, MaxLength, IsString, IsInt, MinLength, IsArray } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class CartItem {
    @IsString()
    @ApiModelProperty()
    product: string;

    @IsInt()
    @ApiModelProperty()
    quantity: string;
}

export class AddProductToCartRequest {

    @IsArray()
    @ApiModelProperty()
    readonly cartItems: CartItem[];
}
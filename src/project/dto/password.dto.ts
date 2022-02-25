import { ApiProperty } from "@nestjs/swagger";

export class PasswordRequest {
    @ApiProperty()
    password: string;
}
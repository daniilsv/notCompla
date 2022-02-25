import { ApiProperty } from "@nestjs/swagger";

export class NameRequest {
    @ApiProperty()
    name: string;
}
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class PaymentInfo {
  @IsString()
  @IsNotEmpty()
  card_holder: string;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  cvv: string;

  @IsString()
  @IsNotEmpty()
  exp_date: string;

  @IsString()
  @IsNotEmpty()
  billing_address: string;
}

export class CreateOrderDto {
  @IsString()
  summary: string;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentInfo)
  payment_info: PaymentInfo;

  @IsNotEmpty()
  courseIds: number[];
}

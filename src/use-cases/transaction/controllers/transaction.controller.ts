import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { TransactionService } from '../services/transaction.service';
import { UserRole } from 'src/use-cases/user/types/users.enum';
import { CreateTransactionDto, GetReportDto } from '../dto/transaction.dto';
import { RateLimitInterceptor } from 'src/common/interceptors/rateLimitInterceptor';
import { User } from 'src/auth/decorator/user.decorator';
import { RateLimit } from 'src/auth/decorator/rateLimit.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.READ_WRITE)
  @UseInterceptors(RateLimitInterceptor)
  @RateLimit({
    points: 10,
    duration: 60, // 1 minute
  })
  async createTransaction(
    @User('id') userId: string,
    @Body() body: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(userId, body);
  }

  @Post('/report')
  @Roles(UserRole.READ_ONLY, UserRole.ADMIN, UserRole.READ_WRITE)
  @UseInterceptors(RateLimitInterceptor)
  async getTransactionReport(@Body() body: GetReportDto) {
    return this.transactionService.generateReport(body);
  }
}

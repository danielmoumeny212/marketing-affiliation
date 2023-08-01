import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Links } from './link';

@Module({
  imports: [
    TypeOrmModule.forFeature([Links])
  ],
  providers: [LinkService],
  controllers: [LinkController]
})
export class LinkModule {}

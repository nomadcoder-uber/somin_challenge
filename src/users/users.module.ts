import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { User } from "./entities/user.entity";
import { Subscribe } from "src/podcast/entities/subscribe.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscribe])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

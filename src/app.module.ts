import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import ormConfig from './common/config/ormconfig';
import configuration from './common/config/configuration';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { ChatsModule } from './modules/chats/chats.module';
import { GroupsModule } from './modules/groups/groups.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TopicModule } from './modules/topics/topic.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { MaintenanceMiddleware } from './middlewares/maintenance.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    TokensModule,
    ChatsModule,
    GroupsModule,
    MessagesModule,
    TopicModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MaintenanceMiddleware).forRoutes('*');
  }
}

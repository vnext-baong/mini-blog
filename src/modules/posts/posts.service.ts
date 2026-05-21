import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { PostListResponse, PostResponse } from './types/post.type';
import { DataSource, IsNull, Like, Not, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { slug } from 'src/utils/functions';
import { MessageResponse } from 'src/common/types/response';
import { Pagination } from 'src/common/types/pagination';
import { COMMENT } from 'src/common/constants/comment';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}
  async getPosts(
    pagination: Pagination,
    userId?: string,
    search?: string,
  ): Promise<PostListResponse> {
    let { page, limit } = pagination;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const [items, total] = await this.postRepository.findAndCount({
      relations: ['author', 'topic'],
      skip: skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        thumbnail: true,
        createdAt: true,
        slug: true,
        topic: {
          id: true,
          name: true,
          slug: true,
        },
        author: {
          id: true,
          name: true,
        },
      },
      where: {
        deletedAt: IsNull(),
        authorId: userId,
        title: search ? Like(`%${search}%`) : undefined,
      },
      order: { createdAt: 'DESC' },
    });
    return {
      items,
      total,
    };
  }
  async getPostBySlug(slug: string): Promise<PostResponse> {
    const post = await this.postRepository.findOne({
      relations: ['author', 'topic'],
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        slug: true,
        thumbnail: true,
        topic: {
          id: true,
          name: true,
          slug: true,
        },
        author: {
          id: true,
          name: true,
        },
      },
      where: { slug, deletedAt: IsNull() },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async getPostById(id: string): Promise<PostResponse> {
    const post = await this.postRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async createPost(
    createPostDto: CreatePostDto,
    thumbnail?: Express.Multer.File,
  ): Promise<PostResponse> {
    try {
      const userId = createPostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const slugtmp = slug(createPostDto.title);
      const slugExists = await this.postRepository.findOne({
        where: { slug: slugtmp },
      });
      if (slugExists) {
        throw new Error('A post with the same title already exists');
      }
      const post = {
        slug: slugtmp,
        published: false,
        ...createPostDto,
        authorId: user.id,
        thumbnail: thumbnail ? `/uploads/${thumbnail.filename}` : undefined,
      };
      const newPost = this.postRepository.create(post);
      return (await this.postRepository.save(newPost)) as PostResponse;
    } catch (error: any) {
      if (thumbnail && thumbnail.filename) {
        const filePath = join('public/uploads', thumbnail.filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
  async fullCreatePost(createPostDto: CreatePostDto): Promise<PostResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userId = createPostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const slugtmp = slug(createPostDto.title);
      const slugExists = await this.postRepository.findOne({
        where: { slug: slugtmp },
      });
      if (slugExists) {
        throw new Error('A post with the same title already exists');
      }

      const post = {
        slug: slugtmp,
        published: true,
        ...createPostDto,
        authorId: user.id,
      };

      const newPost = this.postRepository.create(post);
      const savedPost = await queryRunner.manager.save(newPost);

      const commentTemplates = Object.values(COMMENT);
      for (let i = 0; i < 3; i++) {
        const randomContent =
          commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
        const comment = queryRunner.manager.create('Comment', {
          content: randomContent,
          authorId: user.id,
          postId: savedPost.id,
        });
        await queryRunner.manager.save(comment);
      }

      await queryRunner.commitTransaction();
      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async updatePost(
    id: string,
    updatePostDto: CreatePostDto,
  ): Promise<PostResponse> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, deletedAt: IsNull(), published: false },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      const userId = updatePostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const slugtmp = slug(updatePostDto.title);
      const slugExists = await this.postRepository.findOne({
        where: { slug: slugtmp, id: Not(id) },
      });
      if (slugExists) {
        throw new Error('A post with the same title already exists');
      }
      post.title = updatePostDto.title;
      post.content = updatePostDto.content;
      post.slug = slugtmp;
      post.authorId = user.id;
      if (updatePostDto.topicId !== undefined) {
        post.topicId = updatePostDto.topicId;
      }

      return await this.postRepository.save(post);
    } catch (error) {
      throw new Error('Failed to update post');
    }
  }
  async softDeletePost(id: string): Promise<MessageResponse> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      await this.postRepository.update(id, { deletedAt: new Date() });
      return {
        statusCode: HttpStatus.OK,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async publishPost(id: string): Promise<MessageResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await queryRunner.manager
        .createQueryBuilder(Post, 'post')
        .setLock('pessimistic_write')
        .where('id = :id', { id })
        .andWhere('deletedAt IS NULL')
        .getOne();

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.published) {
        throw new Error('Post is already published');
      }
      await queryRunner.manager
        .createQueryBuilder()
        .update(Post)
        .set({ published: true })
        .where('id = :id', { id })
        .execute();

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: 'Post published successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

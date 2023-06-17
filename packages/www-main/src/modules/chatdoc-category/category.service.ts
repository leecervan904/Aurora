import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { InjectModel } from '@app/transformers/model.transformer';
import { ChatdocCategory } from './category.model';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateOptions, PaginateQuery } from '@app/utils/paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(ChatdocCategory)
    private readonly categoryModel: MongooseModel<ChatdocCategory>,
  ) {}

  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    const existCategory = await this.categoryModel.findOne({
      userId,
      slug: createCategoryDto.slug,
    });
    if (existCategory) {
      throw 'This category already exists';
    }

    const newCategory = await this.categoryModel.create({
      userId,
      ...createCategoryDto,
    });

    return {
      data: newCategory,
    };
  }

  async findAll(userId: number) {
    const categories = await this.categoryModel.find({ userId });

    return {
      data: categories,
    };
  }

  async findOne(userId: number, id: number) {
    const category = await this.categoryModel.findOne({ userId, id });

    return {
      data: category,
    };
  }

  async update(
    userId: number,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const existCategory = await this.categoryModel.findOne({
      userId,
      slug: updateCategoryDto.slug,
    });
    if (existCategory) {
      throw 'This category already exists';
    }

    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      {
        userId,
        id,
      },
      updateCategoryDto,
    );
    if (!updatedCategory) {
      throw 'This category does not exist';
    }

    return {
      data: updatedCategory,
    };
  }

  async remove(userId: number, id: number) {
    const removedCategory = await this.categoryModel.findOneAndRemove({
      userId,
      id,
    });
    if (!removedCategory) {
      throw 'This category does not exist';
    }

    return {
      data: removedCategory,
    };
  }

  async paginator(
    userId: number,
    query: PaginateQuery<ChatdocCategory>,
    options: PaginateOptions,
  ) {
    const categories = await this.categoryModel.paginate(
      { userId, ...query },
      { ...options, lean: true },
    );

    return {
      data: categories,
    };
  }
}

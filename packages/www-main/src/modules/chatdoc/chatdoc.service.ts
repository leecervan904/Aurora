import { Injectable } from '@nestjs/common'

import { InjectModel } from '@app/transformers/model.transformer'
import type { MongooseModel } from '@app/interfaces/mongoose.interface'
import type { PaginateOptions, PaginateQuery } from '@app/utils/paginate'
import type { UpdateQuery } from 'mongoose'
import { ChatdocTag } from '../chatdoc-tag/tag.model'
import { ChatdocCategory } from '../chatdoc-category/category.model'
import type {
  CreateChatdocDto,
  UpdateChatdocCategoryDto,
  UpdateChatdocDto,
  UpdateChatdocTagDto,
} from './chatdoc.dto'
import { Chatdoc } from './chatdoc.model'

@Injectable()
export class ChatdocService {
  constructor(
    // private readonly userService: UserService,
    @InjectModel(Chatdoc) private readonly chatdocModel: MongooseModel<Chatdoc>,
    @InjectModel(ChatdocTag)
    private readonly chatdocTagModel: MongooseModel<ChatdocTag>,
    @InjectModel(ChatdocCategory)
    private readonly chatdocCategoryModel: MongooseModel<ChatdocCategory>,
  ) {}

  async create(userId: number, createChatdocDto: CreateChatdocDto) {
    await this._checkUserExist(userId)

    const doc = await this.chatdocModel.create({
      ...createChatdocDto,
      userId,
    })

    return {
      data: doc,
    }
  }

  async findAll(userId: number) {
    await this._checkUserExist(userId)

    const docs = await this.chatdocModel
      .find({ userId })
      .populate('categoryIds tagIds')
    return {
      data: docs,
    }
  }

  async findOne(userId: number, id: number) {
    await this._checkUserExist(userId)

    const doc = await this.chatdocModel
      .findOne({ userId, id })
      .populate('categoryIds tagIds')

    return {
      data: doc,
    }
  }

  async update(userId: number, id: number, updateChatdocDto: UpdateChatdocDto) {
    await this._checkUserExist(userId)

    const updatedDoc = await this.chatdocModel.findOneAndUpdate(
      {
        userId,
        id,
      },
      updateChatdocDto,
    )

    if (!updatedDoc)
      throw 'Chatdoc not found'

    return {
      data: updatedDoc,
    }
  }

  async updateCategoryOrTag(
    userId: number,
    id: number,
    type: 'category' | 'tag',
    updateDto: UpdateChatdocCategoryDto | UpdateChatdocTagDto,
  ) {
    const updatedDoc = await this.chatdocModel.findOne({ userId, id })
    if (!updatedDoc)
      throw 'Chatdoc not found'

    if (type === 'category') {
      if (!updatedDoc.categoryIds)
        updatedDoc.categoryIds = []

      const category = await this.chatdocCategoryModel.findOneAndUpdate({
        userId,
        id: updateDto.id,
      })

      if (!category)
        throw 'Chatdoc category not found'

      const query: UpdateQuery<Chatdoc> = {}
      if (updateDto.type === 'add')
        query.$push = { categoryIds: category._id }

      if (updateDto.type === 'remove')
        query.$pull = { categoryIds: category._id }

      await this.chatdocModel.findOneAndUpdate(
        {
          userId,
          id,
        },
        query,
      )

      return {
        message: 'success',
      }
    }

    if (type === 'tag') {
      if (!updatedDoc.tagIds)
        updatedDoc.tagIds = []

      const tag = await this.chatdocTagModel.findOneAndUpdate({
        userId,
        id: updateDto.id,
      })

      if (!tag)
        throw 'Chatdoc tag not found'

      const query: UpdateQuery<Chatdoc> = {}
      if (updateDto.type === 'add')
        query.$push = { tagIds: tag._id }

      if (updateDto.type === 'remove')
        query.$pull = { tagIds: tag._id }

      await this.chatdocModel.findOneAndUpdate(
        {
          userId,
          id,
        },
        query,
      )

      return {
        message: 'success',
      }
    }
  }

  async remove(userId: number, id: number) {
    await this._checkUserExist(userId)

    const removedDoc = await this.chatdocModel.findOneAndRemove({ userId, id })
    if (!removedDoc)
      throw 'Chatdoc not found'

    return {
      data: removedDoc,
    }
  }

  async paginator(
    userId: number,
    query: PaginateQuery<Chatdoc>,
    options: PaginateOptions,
  ) {
    await this._checkUserExist(userId)

    const categoriesData = await this.chatdocModel.paginate(
      { userId, ...query },
      { ...options, lean: true },
    )

    return categoriesData
  }

  async _checkUserExist(userId: number) {
    // const user = await this.userService.findOne(userId);
    // if (!user) {
    //   throw 'User not found';
    // }
  }
}

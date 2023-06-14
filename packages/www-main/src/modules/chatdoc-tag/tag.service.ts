import { Injectable } from "@nestjs/common"
import { CreateTagDto, UpdateTagDto } from "./tag.dto"
import { ChatdocTag } from "./tag.model"
import { InjectModel } from "@app/transformers/model.transformer"
import { MongooseModel } from "@app/interfaces/mongoose.interface"
import { PaginateOptions, PaginateQuery } from "@app/utils/paginate"

@Injectable()
export class TagService {
  constructor(
    @InjectModel(ChatdocTag)
    private readonly tagModel: MongooseModel<ChatdocTag>
  ) {}

  async create(userId: number, createTagDto: CreateTagDto) {
    const existedTag = await this.tagModel.findOne({
      userId,
      slug: createTagDto.slug
    })
    if (existedTag) {
      throw `The slug ${createTagDto.slug} is existed!`
    }

    const newTag = await this.tagModel.create({ userId, ...createTagDto })
    return {
      data: newTag
    }
  }

  async findAll(userId: number) {
    const tags = await this.tagModel.find({ userId })
    return {
      data: tags
    }
  }

  async findOne(userId: number, tagId: number) {
    return this.tagModel
      .findOne({ userId, id: tagId })
      .exec()
      .then((res) => res || Promise.reject(`Tag '${tagId}' not found!`))
  }

  async update(userId: number, id: number, updateTagDto: UpdateTagDto) {
    // 1. slug 已存在
    const existedTag = await this.tagModel.findOne({
      userId,
      slug: updateTagDto.slug
    })
    if (existedTag && String(existedTag._id) !== String(id)) {
      throw `Tag slug '${updateTagDto.slug}' is already exist!`
    }

    // 2. tag 不存在
    const newTag = await this.tagModel.findOneAndUpdate(
      { userId, id },
      updateTagDto,
      {
        new: true
      }
    )
    if (!newTag) {
      throw `Tag ${id} not found!`
    }

    return {
      data: newTag
    }
  }

  async remove(userId: number, id: number) {
    const tag = await this.tagModel.findOneAndRemove({ userId, id })
    if (!tag) {
      throw `Tag ${id} not found!`
    }

    return {
      data: tag
    }
  }

  // async aggregate() {}

  async paginator(
    userId: number,
    query: PaginateQuery<ChatdocTag>,
    options: PaginateOptions
  ) {
    console.log(userId, query, "---")
    const tags = await this.tagModel.paginate(
      { userId, ...query },
      {
        ...options,
        lean: true
      }
    )

    return {
      data: tags
    }
  }
}

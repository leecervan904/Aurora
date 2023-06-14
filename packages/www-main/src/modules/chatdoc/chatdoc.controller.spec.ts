import { Test, TestingModule } from "@nestjs/testing"
import { ChatdocController } from "./chatdoc.controller"
import { ChatdocService } from "./chatdoc.service"

describe("ChatdocController", () => {
  let controller: ChatdocController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatdocController],
      providers: [ChatdocService]
    }).compile()

    controller = module.get<ChatdocController>(ChatdocController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})

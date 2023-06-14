import { Test, TestingModule } from "@nestjs/testing"
import { ChatdocService } from "./chatdoc.service"

describe("ChatdocService", () => {
  let service: ChatdocService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatdocService]
    }).compile()

    service = module.get<ChatdocService>(ChatdocService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})

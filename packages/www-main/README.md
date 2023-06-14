## BUG

- 设置异常拦截器后，不要在 `service` 中通过 `try...catch` 捕获错误，直接 `throw` 即可，否则外部不能捕获错误

## feature

### 路径还是参数

有这样的功能列表：

```
user
  - tag
  - category
  - doc
```

保存 `tag` 时还需要判断所属用户（比如判断用户是否存在，权限是否正确），是否有便捷操作，比如守卫和过滤器？

- 一种变通：把 `userId` 记录在 token 里面，这样可以：
  - 保证用户是已存在的，因为 token 由用户信息生成，但是要考虑一些问题
    - 依旧是处理过期 token 的问题
  - 能够取到 `userId` 而不用额外传递参数

### 如何注入类型

如上述的代码实现中，`AuthGuard` 在请求对象上新增了 `req.user` 属性，如何自动扩展 `Request` 类型：

## docker

问题: Dockerfile 和 docker-compose 的区别

- Dockerfile 用于构建镜像，后续可以使用该镜像创建容器
- docker-compose 用于创建一系列的容器服务，并且易于管理容器间

问题：node 服务无法连接 mongodb
解决：使用 links 参数连接，并且在 MONGODB_URI 中使用 mongod 的 service 名字引用主机

```sh
version: '3'
services:
  nest:
    image: leecervan/chatgpt-doc-nest
    platform: linux/arm64
    restart: always
    ports:
      - '3030:3000'
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/BetterGPT
    depends_on:
      - mongo
    links:
      - mongo
  mongo:
    image: mongo
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - '9900:27017'
volumes:
  mongo_data:
```

问题：M1 本地构建可以运行（默认构架的是 arm 版本的景象），但是服务器上 node 服务总是重启，在 x86 服务器上运行时需要构建 x86 镜像。
解决：设置构建可用于多个平台的镜像

```sh
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t leecervan/chatgpt-doc-nest .
```

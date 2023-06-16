const types = [
  {
    value: 'feat',
    name: '新功能',
  },
  {
    value: 'update',
    name: '在feat内修改',
  },
  {
    value: 'fix',
    name: '修复bug',
  },
  {
    value: 'docs',
    name: '文档改变',
  },
  {
    value: 'style',
    name: '代码格式改变',
  },
  {
    value: 'refactor',
    name: '某个已有功能重构',
  },
  {
    value: 'perf',
    name: '性能优化',
  },
  {
    value: 'test',
    name: '增加测试',
  },
  {
    value: 'build',
    name: '改变了build工具 如 grunt换成了 npm',
  },
  {
    value: 'revert',
    name: '撤销上一次的 commit',
  },
  {
    value: 'chore',
    name: '构建过程或辅助工具的变动',
  },
  {
    value: 'del',
    name: '删除文件或方法',
  },
]
module.exports = {
  prompter(cz, commit) {
    cz.prompt([
      {
        type: 'list',
        name: 'type',
        message: '选择提交类型',
        choices: types.map(({ value, name }) => ({
          value,
          name: `(${value})${name}`,
        })),
      },
      {
        type: 'input',
        name: 'subject',
        message: '提交内容',
      },
      {
        type: 'input',
        name: 'body',
        message: '原因',
      },
    ]).then((answers) => {
      const { type, subject, body } = answers
      commit(`${type}: ${subject}\n\n` + `reason: ${body}`)
    })
  },
}

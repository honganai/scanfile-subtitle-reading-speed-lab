# SRT 阅读速度演示源码

这是一个由 Scanfile 授权发布、经 AI 辅助编写的 MIT 许可代码示例，供字幕作者和网页代码学习者检查字符计数与显示时长之间的关系。它是独立的教学示例，不是 Scanfile 在线翻译服务的源码，也不代表服务已经开源。

## 本地运行

将 `index.html`、`style.css` 和 `reading-speed.js` 放在同一目录，用现代浏览器打开 HTML 文件即可。不需要构建、安装依赖或调用外部接口。界面当前为英语；可以结合下面的规则阅读结果。

使用 Node.js 20 或更新版本检查计算逻辑：

```sh
node reading-speed.test.cjs
```

## 结果如何解释

- 计算器按每条 SRT 字幕的字符数与显示秒数计算每秒字符数（CPS）。阈值由使用者选择；界面的默认值只是演示值，不是行业标准，也不能代替实际观众测试。
- 现代浏览器优先用 `Intl.Segmenter` 计算字素簇，避免把组合 emoji 等可见字符简单当作多个 UTF-16 单元。没有该 API 时会使用后备计数方式；界面会提示其局限。
- 常见字幕格式标签和实体会影响可见文本计数；请结合源码中的处理规则检查具体文件。这个示例不能验证字幕格式的所有边界条件。
- 示例包含拥挤字幕、CJK 文字、组合 emoji 和无效时长。所有演示句子均为虚构，不包含客户字幕，也不是某次真实翻译项目的验收结果。
- 它不翻译、转录或修复字幕，也不评价语言准确性、法律适用性或完整的无障碍表现。

## 文件与边界

`reading-speed.js` 包含解析和计算逻辑，`reading-speed.test.cjs` 包含现有逻辑检查，HTML/CSS 提供浏览器演示界面。输入作为文本呈现，计算代码本身不发起网络请求。这一描述不涵盖代码托管平台自身的统计、日志或隐私政策。

保留的英文说明见 `README.en.md`。既有演示曾公开发布于网页代码平台；这里提供可下载审阅的实际源码和中文使用说明，不声称它是首次发布、一个全新的产品或平台推荐。

## 许可与关联

保留 `LICENSE` 中的 MIT 许可及版权声明。该示例按现状提供，没有准确性、适销性或适用性担保。

维护方与 [Scanfile](https://scanfile.online/) 有授权关联。Scanfile 是另一个基于预付使用额度的文件翻译服务；条件性免费预览并不代表完整翻译永远免费。代码的 MIT 许可不延伸到在线服务、品牌或客户资料。这里不包含评价、评分、投票请求或托管平台背书。


## AI 开发与测试说明 / AI development and testing disclosure

本示例在代码、界面、合成样例、逻辑检查和文档开发中大量使用了生成式 AI。参与范围、已做的自动化检查和未验证的边界见 [AI-USAGE.md](AI-USAGE.md)。没有宣称独立人工代码审查、受试者研究或生产验证。

See [AI-USAGE.md](AI-USAGE.md) for the extent of AI involvement, automated verification, provenance and limitations. This repository contains the separate educational example, not the source of the Scanfile translation service.

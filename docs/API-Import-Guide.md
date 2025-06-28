# 录取数据批量导入API开发文档

## 接口基本信息
- **端点**: `POST /api/admission/admin/import`
- **认证方式**: API Key
- **Content-Type**: `application/json`

## 认证要求
请求必须在Header中包含有效的API Key:
```
Authorization: Bearer {your_api_key}
```

## 请求字段说明

### 根字段
| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| batch_id | string | 是 | 批次唯一标识 |
| admissions | array | 是 | 录取数据数组 |

### 录取数据字段
| 字段名 | 类型 | 长度 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|------|
| ksh | string | 30 | 是 | 考生号 | "20230001" |
| zkzh | string | 30 | 否 | 准考证号 | "2023BJ001" |
| sfzh | string | 30 | 否 | 身份证号 | "110101200001011234" |
| xm | string | 100 | 是 | 姓名 | "张三" |
| xb | string | 10 | 是 | 性别 | "男" |
| lqzt | string | 30 | 是 | 录取状态 | "已录取" |
| ssmc | string | 30 | 否 | 省市名称 | "北京市" |
| pcmc | string | 255 | 否 | 批次名称 | "本科一批" |
| klmc | string | 50 | 否 | 科类名称 | "理科" |
| jhxz | string | 100 | 否 | 计划性质 | "普通计划" |
| tdcj | string | 10 | 否 | 投档成绩 | "650" |
| yxmc | string | 255 | 否 | 院校名称 | "清华大学" |
| lqzymc | string | 255 | 否 | 录取专业名称 | "计算机科学与技术" |
| xymc | string | 255 | 否 | 学院名称 | "计算机学院" |
| xqmc | string | 255 | 否 | 校区名称 | "主校区" |
| tzsbh | string | 50 | 否 | 通知书编号 | "2023-TS-001" |
| emsdh | string | 50 | 否 | EMS单号 | "EMS123456789" |
| sfyzm | string | 4 | 否 | 身份证验证码 | "1234" |
| jtdz | string | 255 | 否 | 家庭地址 | "北京市海淀区清华园1号" |
| yzbm | string | 10 | 否 | 邮政编码 | "100084" |
| sjr | string | 50 | 否 | 收件人 | "张三" |
| bdsj | string | 50 | 否 | 报到时间 | "2023-09-01" |
| sjh | string | 20 | 否 | 手机号 | "13800138000" |
| bz | string | 255 | 否 | 备注 | "新生奖学金获得者" |

## 完整请求示例
```json
{
  "batch_id": "2023-batch-1",
  "admissions": [
    {
      "ksh": "20230001",
      "zkzh": "20230001",
      "sfzh": "110101200001011234",
      "xm": "张三",
      "xb": "男",
      "lqzt": "已录取",
      "ssmc": "北京市",
      "pcmc": "本科一批",
      "klmc": "理科",
      "jhxz": "普通计划",
      "tdcj": "650",
      "yxmc": "清华大学",
      "lqzymc": "计算机科学与技术",
      "xymc": "计算机学院",
      "xqmc": "主校区",
      "tzsbh": "2023-TS-001",
      "emsdh": "EMS123456789",
      "sfyzm": "1234",
      "jtdz": "北京市海淀区清华园1号",
      "yzbm": "100084",
      "sjr": "张三",
      "bdsj": "2023-09-01",
      "sjh": "13800000000",
      "bz": "新生奖学金获得者"
    }
  ]
}
```

## 响应格式
成功响应 (200):
```json
{
  "success": true,
  "data": {
    "imported_count": 1,
    "failed_count": 0,
    "batch_id": "2023-batch-1"
  }
}
```

错误响应 (400/401/500):
```json
{
  "success": false,
  "error": "错误描述"
}
```

## 注意事项
1. 必填字段必须提供，否则会导入失败
2. 字段长度不能超过定义的限制
3. 日期字段使用YYYY-MM-DD格式
4. 单次导入建议不超过1000条记录
5. 考生号(ksh)必须唯一
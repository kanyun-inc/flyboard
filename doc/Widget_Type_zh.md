不同类型Widget的`type` and `config`字段。

### Spline（折线图）

type: `1`

```javascript
config:
{
    "name": "new users in 24 hours",  // 名称
    "limit": 100,  // 展示纪录的条数
    "maxThreshold": 90,  // 可选，Y轴的最大值
    "minThreshold": 0,   // 可选，Y轴的最小值
    "dataInfos": [{    // 支持多个dataSource
         "id": 3
     },
     {
         "id": 4
     }]
    }
}
```

### Pie（饼图）

type: `2`

```javascript
config:
{
    "name": "all users",  // 名称
    "dataInfos": [{    // 支持多个dataSource
         "id": 3
     },
     {
         "id": 4
     }]
}
```

### Donut（环形图）

type: `3`

```javascript
config:
{
    "name": "SMS arrival rate",  // 名称
    "dataInfos": [{
        "id": 3
    }]  // 数组长度为1，支持单个数据源
}
```

### Number（数字）

type: `4`

```javascript
config:
{
    "name": "all users",  // 名称
    "dataInfos": [{
        "id": 3
    }]  // 数组长度为1，支持单个数据源dataSource
}
```

### Column（柱形图）

type: `5`

```javascript
config:
{
    "name": "middle school users",  // 名称
    "limit": 100,  // 展示的数据条数
    "dataInfos": [{   // 支持多个dataSource
         "id": 3
     },
     {
         "id": 4
     }]
}
```
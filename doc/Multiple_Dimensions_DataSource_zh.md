#### 第 1 步， 配置
***
##### DataSource

在 `config` 字段中配置多维度，dataSource支持最少0个维度，最多3个维度。

eg.
```javascript
{
    "config":{
        "dimensions": [      // 可选
       {
            "key": "course",
            "name": "COURSE",
            "type": "string"    // 不需要填写，默认值
        },
       {
            "key": "class_time",
            "name": "CLASS HOUR",
            "type": "string"    // 不需要填写，默认值
        },
       ...
       ]
    }
}
```

#### 第 2 步， 准备数据
***
##### Record

dataSource设置的所有维度，在打数据时必须包含每个维度的信息。

eg.
```javascript
{
    "value": 100,
    "year": 2014,
    "month": 7,
    "day": 3,
    "hour": 16,
    "minute": 0,
    "second": 0,
    "course": 'english',   // 第1个维度“course”
    "class_time": "xxx"    // 第2个维度“class_time”
}
```

#### 第 3 步， 展示数据
***

对于dataSource中的所有维度，我们可以针对**每个维度**选取**不同模式**，由此来选择性地展示同一个dataSource的不同数据。

模式 | 说明
--- | ----
sum | 对于同一时刻，维度值不同的一系列records，将其值求和并展示该总和，将他们当作一个record
specify | 设定维度的值，只有维度值为设定值的record才会被展示出来
ignore | 拆分records。拆分前，dataSource只有1组数据，即在折线图中则显示为一条线；拆分后，dataSource有多组数据，即在折线图中显示为多条线，有相同维度值的records会分在同一组中。<br> 例：如果有dataSource有2个维度，且每个维度分别有2个值，则如果对每个维度都选择"ignore" 模式，将会展示 2*2 组数据。

##### Widget

－ | 支持单个dataSource的Widget | 支持多个dataSource的Widget
--- | --- | --- 
Widget类型 | Number（数字）, Donut（环形图） | Spline（折线图）, Pie（饼图）, Column（柱形图）
模式 | 支持1个dataSource。<br> 1、 没有维度的dataSource； <br> 2、 有维度的dataSource，对于每个维度，可以选择“speccify”或或者“sum”模式。 | 支持单个或多个dataSource。 <br> 1、 一个dataSource。如果有维度，每个维度可以选择“sum”，“specify”，“ignore”模式； <br> 2、 多个dataSource，如果有维度，每个维度可以选择“sum”，“specify”模式


例： 

支持单个dataSource的Widget，例1:
```javascript
{
    "config":{
        "dataInfos":[
            {
                "id": 1        // 没有维度的dataSource
            }
        ]
    }
}
```

支持单个dataSource的Widget，例2:
```javascript
{
    "config":{
        "dataInfos":[
            {                  // 有2个维度的dataSource
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "math"    // “specify”模式
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // “sum”模式
                 }]
            }
        ]
    }
}
```

支持多个dataSource的Widget，例1:
```javascript
{
    "config":{
        "dataInfos":[
            {                  // 有2个维度的dataSource
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "ignore"    // “ignore”模式
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // “sum”模式
                 }]
            }
        ]
    }
}
```

支持多个dataSource的Widget，例2:

```javascript
{
    "config":{
        "dataInfos":[
            {
                "id": 1        // 没有维度的dataSource
            },
            {                  // 有2个维度的dataSource
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "math"    // “specify”模式
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // “sum”模式
                 }]
            }
        ]
    }
}
```
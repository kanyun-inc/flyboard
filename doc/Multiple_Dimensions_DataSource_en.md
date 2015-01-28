#### Step 1.  Configure
***
##### DataSource

The dimensions are configured in `config` field, at least 0 dimension, and at most 3 dimensions are supported.

eg.
```javascript
{
    "config":{
        "dimensions": [      // optional
       {
            "key": "course",
            "name": "COURSE",
            "type": "string"    // not need to fill in, default value
        },
       {
            "key": "class_time",
            "name": "CLASS HOUR",
            "type": "string"    // not need to fill in, default value
        },
       ...
       ]
    }
}
```

#### Step 2.  Prepare data
***
##### Record

dimension value must be included when post record, and the number of dimensions must match.

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
    "course": 'english',   // 1st dimension, the key of dimension, 'course', is used here
    "class_time": "xxx"    // 2nd dimension, the key of dimension, 'class_time', is used here
}
```

#### Step 3.  Display data
***

For dataSource with dimensions, we can choose **different mode** for **each dimension**, then we can display different data with the same dataSource.

Mode | Description
--- | ----
sum | for records with same date_time, but different value for the dimension, the sum of them will be displayed, as if they are one record
specify | specify the value of dimension, only the records that match will be displayed
ignore | split record list. Before split, there is one group of data for the dataSource, and one line will be displayed in spline; After split, there will be several groups of data for the dataSource, and several lines will be displayed in spline, records with the same value for the dimension will be in the same line. <br> eg. if theres 2 dimension, with 2 values, and both 'split', there will be 2*2 lines.

##### Widget

－ | single DataSource Widget | Multiple DataSource Widget
--- | --- | --- 
Widget Type | Number, Donut | Spline, Pie, Column
Mode | support one dataSource. <br> 1.  One dataSource with no dimensions;  <br> 2.  One dataSource with dimensions, for each dimension, 'sum' or 'specify' can be chosen. | support multiple dataSources. <br> 1.  One dataSource, if has dimensions, 'sum', 'specify', or 'split' can be chosen; <br>  2.  One or Multiple dataSources, if dataSource has dimensions, 'sum', 'specify' can be chosen


eg. 

Single DataSource example 1:
```javascript
{
    "config":{
        "dataInfos":[
            {
                "id": 1        // dataSource with no dimensions
            }
        ]
    }
}
```

Single DataSource example 2:
```javascript
{
    "config":{
        "dataInfos":[
            {                  // dataSource with 2 dimensions
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "math"    // 'specify'
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // 'sum'
                 }]
            }
        ]
    }
}
```

Multiple DataSource example 1:
```javascript
{
    "config":{
        "dataInfos":[
            {                  // dataSource with 2 dimensions
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "ignore"    // 'ignore'
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // 'sum'
                 }]
            }
        ]
    }
}
```

Multiple DataSource example 2:

```javascript
{
    "config":{
        "dataInfos":[
            {
                "id": 1        // dataSource with no dimensions
            },
            {                  // dataSource with 2 dimensions
                "id": 3,
                "dimensions": [{
                    "key": "course",
                    "name": "COURSE",
                    "value": "math"    // 'specify'
                    },
                   {
                    "key": "class_time",
                    "name": "CLASS HOUR",
                    "value": "sum"    // 'sum'
                 }]
            }
        ]
    }
}
```
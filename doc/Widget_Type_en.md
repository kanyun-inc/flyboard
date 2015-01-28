The `type` and `config` field for different widget types.

### Spline

type: `1`

```javascript
config:
{
    "name": "new users in 24 hours",  // name
    "limit": 100,  // the number of displayed records
    "maxThreshold": 90,  // optional, max value of Y axis
    "minThreshold": 0,   // optional, min value of Y axis
    "dataInfos": [{   // support multiple dataSources
         "id": 3
     },
     {
         "id": 4
     }]
    }
}
```

### Pie

type: `2`

```javascript
config:
{
    "name": "all users",  // name
    "dataInfos": [{    // support multiple dataSources
         "id": 3
     },
     {
         "id": 4
     }]
}
```

### Donut

type: `3`

```javascript
config:
{
    "name": "SMS arrival rate",  // name
    "dataInfos": [{
        "id": 3
    }]  // array with 1 element, only support single dataSource
}
```

### Number

type: `4`

```javascript
config:
{
    "name": "all users",  // name
    "dataInfos": [{
        "id": 3
    }]  // array with 1 element, only support single dataSource
}
```

### Column

type: `5`

```javascript
config:
{
    "name": "middle school users",  // name
    "limit": 100,  // the number of displayed records
    "dataInfos": [{
         "id": 3
     },
     {
         "id": 4
     }],  // support multiple dataSources
}
```
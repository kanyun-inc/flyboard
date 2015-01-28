###注意
***

添加了用户认证后，单独发送api请求时需要带有token参数，token参数可通过接口"/api/users/token/:id"获得。

#####【例】
<p> 添加token前：/api/projects/sdfe-i123-I142-d1kd/data_sources/login.user </p>
<p>  添加token后：/api/projects/sdfe-i123-I142-d1kd/data_sources/login.user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI </p>

***

# 可视化API

### records

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 POST | /api/projects/:uuid/data_sources/:key| Record | － | 新建 record，api中包含record所属的project的**UUID**与dataSource的**key**
GET | /api/records/:id | Record | - | 获取某个Record
GET  | /api/data_sources/:id/records| Record | [count / periodValue / limit]: 返回count个record / 一段时期内的Record / 返回最近的limit个时间点的Record；[orderBy]：返回排序后的record列表； [dimensions]: json类型，返回满足dimensions参数条件的records;| 返回某个data_source的所有满足条件的records
DELETE | /api/records/:id | - | - | 删除某个record
DELETE | /api/projects/:uuid/data_sources/:key | - | [year/month/day/hour/minute/second]:默认值为0 | 批量删除所有满足条件的record

#### Record
```javascript
{
    "value": 100,
    "year": 2014, // 可选
    "month": 6, // 可选, 1-12
    "day": 24, // 可选, 1-31
    "hour": 23, // 可选, 0-23
    "minute": 12, // 可选, 0-59
    "second": 0, // 可选, 0-59
    "course": "english"  //可选
}
```

### folders

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET  | /api/folders/:id | Folder | - | 返回某个folder
 GET  | /api/folders | Folder | [project_id]: 返回某个project的所有folder; | 返回所有folders
 GET  | /api/folders/:parent_id/folders | Folder | [project_id]: 返回某个project的所有folder; | 返回属于某个folder_id的所有子folders，如果parent_id为空，返回所有不属于其他folder的folders
 POST | /api/folders| Folder | - | 新建一个 folder
 PUT  | /api/folders/:id | Folder | - | 更新 folder
 DELETE | /api/folders/:id | - | [recursive]: 是否递归删除属于该folder的子folders和dataSouces; | 删除folder。如果recursive==true, 递归删除属于该folder的所有子folder和data_source；否则，将其子folder和data_source修改为属于当前folder的父folder

#### Folder
```javascript
{
    "id": 1, // 创建不需要 id
    "name": xxx,
    "project_id": 1,
    "parent_id": 2, // 可选
}
```

### data_sources

 方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/data_sources | DataSource | [folder_id]: 返回属于某个folder的所有dataSource; [project_id]: 返回属于某个projet的dataSource; | folder_id参数：当folder_id为0，获取所有不属于任何folder的dataSources
 GET | /api/data_sources/:id | DataSource  | - | 根据 id 获取 dataSource
 POST | /api/data_sources | DataSource | - | 新建一个 dataSource
 PUT | /api/data_sources/:id | DataSource | DataSource | 更新 dataSource
 DELETE | /api/data_sources/:id | - | - | 删除 dataSource

#### DataSource
```javascript
{
    "id": 1, // 创建不需要 id,
    "key": "login.user",
    "project_id": 1, 
    "name": "登录用户数",
    "folder_id": 1  //可选，没有设置此属性，表示该dataSource不属于任何folder
    "config":{
        "dimensions": [{     //可选
            "key": "course",
            "name": "课程",
            "type": "string"    //不需要填写，默认都是string
        }]
    }
}
```

### projects

 方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/projects | Project | - | 获取所有的 project
 GET | /api/projects/:id | Project | - | 根据 id 获取 project
 POST | /api/projects | Project | Project | 新建一个 project
 PUT | /api/projects/:id | Project | Project | 更新 project
 DELETE | /api/projects/:id | - | - | 删除 project

#### Project
```javascript
{
    "id": 1, // 创建不需要 id
    "name": "foo"
}
```

### dashboards

 方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/dashboards | Dashboard | [project_id]: 返回属于某个project的dashboards; | 获取dashboard列表
 GET | /api/dashboards/:id | Dashboard ｜ － | 根据 id 获取 dashboard
 POST | /api/dashboards | Dashboard | Dashboard | 新建一个 dashboard
 PUT | /api/dashboards/:id | Dashboard | Dashboard | 更新 dashboard
 DELETE | /api/dashboards/:id | - | - | 删除 dashboard

#### Dashboard
```javascript
{
    "id": 1, // 创建不需要 id
    "name": "foo",
    "project_id": 1,
    "config": {
        "layout": [{
            "id": 1,
            "first_grid": [0,0]
            "last_grid": [5,5]
        },
        {
            "id": 3,
            "first_grid": [0,6],
            "last_grid": [5,11]
        },
        {
            "id": 5,
            "first_grid": [6,0],
            "last_grid": [11,11]
        }]
    }
}
```

```
 ---------------------------------
|                |                |
|    widget_1    |    widget_3    |
|                |                |
 ---------------------------------
|                                 |
|            widget_5             |
|                                 |
 ---------------------------------
```

### widgets

 方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/dashboards/:dashboardId/widgets | Widget | - | 获取某个 dashboard 中的所有 widget
 GET | /api/dashboards/:dashboardId/widgets/:id | Widget ｜ － | 根据 id 获取 widget
 POST | /api/dashboards/:dashboardId/widgets | Widget | Widget | 新建一个 widget
 PUT | /api/dashboards/:dashboardId/widgets/:id | Widget | Widget | 更新 widget
 DELETE | /api/dashboards/:dashboardId/widgets/:id | - | - | 删除 widget

#### Widget
```javascript
{
    "id": 1, // 创建不需要 id
    "type": 1, // widget 的类型，详见 widget 配置
    "dashboard_id": 1, 
    "config": {} // widget 配置
}
```
不同的 widget 有着不同的 config 结构，详情参考 [widget 配置](https://github.com/yuantiku/flyboard/wiki/Widget-%E9%85%8D%E7%BD%AE)

# 用户系统API

#### users

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/users/current | User | - | 返回当前登录用户
 PUT | /api/users/salt_reset/:id | User | - | 重置用户的salt值
 GET | /api/users/token/:id | token | - | 返回某一用户的token
 GET | /api/users | User | - | 返回所有用户
 GET | /api/users/:id | User | - | 根据id返回某个用户
 POST | /api/users | User | User | 新建一个 user
 PUT | /api/users/:id | User | User | 更新 user
 DELETE | /api/users/:id | - | - | 删除 user

### User
```javascript
{
    "id": 1, //创建不需要id
    "email": "abc@abs.com",
    "salt": "8sfdjUds3sdfa" //随机字符串。创建不需要salt，会自动生成
}
```

### roles

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/roles | Role | - | 返回所有Role
 GET | /api/roles/:id | Role | - | 根据id返回Role
 POST | /api/roles | Role | Role | 新建Role
 PUT | /api/roles/:id | Role | Role | 更新Role
 DELETE | /api/roles/:id | - | - | 删除Role
 
### Role
```javascript
{
    "id": 1,  //创建不需要id
    "name": "admin",
    "scope": 2  //表示global权限，可以操作任何Project
}
{
    "id": 3, //创建不需要id
    "name": "member",
    "scope": 2  //表示local权限，只能操作指定的Project
}
```

### user_role

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/user_roles | userRole | [user_id]: 返回某User的所有userRole列表; [role_id]: 返回某Role的所有userRole列表; [project_id]:返回某project的userRole列表; | -
 GET | /api/user_roles/:id | userRole | - | 根据id返回userRole
 POST | /api/user_roles | userRole | userRole | 新建userRole
 PUT | /api/user_roles/:id | userRole | userRole | 更新userRole
 DELETE | /api/user_roles/:id | - | - | 删除userRole

### userRole

```javascript
{
    "id": 1,  //创建不需要id
    "user_id": 1,
    "role_id": 3,
    "project_id": 5  //当role具有global权限时，project_id应设置为0，表明有权操作所有project；否则，设为某一project的id，表明有权操作该project
}
```

### rolePrivileges

方法 | URL | 返回值 | 参数 | 说明
 --- | --- | --- | --- | ---
 GET | /api/role_privileges | rolePrivilege | [role_id]: 返回某个Role的所有权限; | 返回Role的权限列表
 POST | /api/role_privileges | rolePrivilege | rolePrivilege | 添加一个rolePrivilege
 DELETE | /api/role_privileges/:role_id | - | - | 删除某个role的所有privilege记录

### RolePrivilege

```javascript
{
    "resource": "PROJECT",
    "operation": "GET",
    "role_id": 1
}
```
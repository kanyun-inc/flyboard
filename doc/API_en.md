###Attention
***

After User Authentication is added to flyboard, the param 'token' should be added in all api request, the value of 'token' can be gotten by "/api/users/token/:id".

#####【example】
<p> request without token: '/api/projects/sdfe-i123-I142-d1kd/data_sources/login.user' </p>
<p> request with token: '/api/projects/sdfe-i123-I142-d1kd/data_sources/login.user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI' </p>

***

# API for Visualization

### records

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 POST | /api/projects/:uuid/data_sources/:key| Record | － | Create a new record. Params in URL include the **UUID** of project and **key** of dataSource which the record belongs to.
GET | /api/records/:id | Record | - | Get a record
GET  | /api/data_sources/:id/records| Record | [count / periodValue / limit]: return 'count' number of records / return records in a period / return records with the lastest 'limit' number of date_time;[orderBy]：return ordered records; [dimensions]: json type, return records match dimension param;| return records of the data_source that match
DELETE | /api/records/:id | - | - | delete a record
DELETE | /api/projects/:uuid/data_sources/:key | - | [year/month/day/hour/minute/second]:default value is 0 | delete all records that match

#### Record
```javascript
{
    "value": 100,
    "year": 2014, // optional
    "month": 6, // optional, 1-12
    "day": 24, // optional, 1-31
    "hour": 23, // optional, 0-23
    "minute": 12, // optional, 0-59
    "second": 0, // optional, 0-59
    "course": "english"  //optional
}
```

### folders

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET  | /api/folders/:id | Folder | - | get a folder
 GET  | /api/folders | Folder | [project_id]: return all folders that belong to the project | return folders
 GET  | /api/folders/:parent_id/folders | Folder | [project_id]: return subfolders of the project | return subfolders of the folder，if parent_id is 0, return all folders that don't belong to any folder
 POST | /api/folders| Folder | - | create a new folder
 PUT  | /api/folders/:id | Folder | - | update folder
 DELETE | /api/folders/:id | - | [recursive]: if true, delete the folder and all subfolders and dataSources of it, too. if false, only delete the folder, and all subfolders and dataSources will belong to its parentfolder. | delete folder

#### Folder
```javascript
{
    "id": 1, // no need when create a folder
    "name": xxx,
    "project_id": 1,
    "parent_id": 2, // optional
}
```

### data_sources

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/data_sources | DataSource | [folder_id]: return all dataSources that belong to the folder; [project_id]: return all dataSources that belong to the project | folder_id: if folder_id is 0，return all dataSources that don't belong to any folder
 GET | /api/data_sources/:id | DataSource  | - | get a dataSource
 POST | /api/data_sources | DataSource | - | create a new dataSource
 PUT | /api/data_sources/:id | DataSource | DataSource | update dataSource
 DELETE | /api/data_sources/:id | - | - | delete a dataSource

#### DataSource
```javascript
{
    "id": 1, // no need when create a dataSource
    "key": "login.user",
    "project_id": 1, 
    "name": "login user",
    "folder_id": 1  //optional, having no folder_id means the dataSource don't belong to any folder
    "config":{
        "dimensions": [{     //optional
            "key": "course",
            "name": "COURSE",
            "type": "string"    //no need, this is default value
        }]
    }
}
```

### projects

 Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/projects | Project | - | get all projects
 GET | /api/projects/:id | Project | - | get a project
 POST | /api/projects | Project | Project | create a new project
 PUT | /api/projects/:id | Project | Project | udpate project
 DELETE | /api/projects/:id | - | - | delete project

#### Project
```javascript
{
    "id": 1, // no nee when create a project
    "name": "foo"
}
```

### dashboards

 Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/dashboards | Dashboard | [project_id]: return all dashboards that belong to the project; | get dashboards
 GET | /api/dashboards/:id | Dashboard ｜ － | get a dashboard
 POST | /api/dashboards | Dashboard | Dashboard | create a new dashboard
 PUT | /api/dashboards/:id | Dashboard | Dashboard | update dashboard
 DELETE | /api/dashboards/:id | - | - | delete dashboard

#### Dashboard
```javascript
{
    "id": 1, // no need when create a dashboard
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

 Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/dashboards/:dashboardId/widgets | Widget | - | get all widgets that belong to the dashboard
 GET | /api/dashboards/:dashboardId/widgets/:id | Widget ｜ － | get a widget
 POST | /api/dashboards/:dashboardId/widgets | Widget | Widget | create a new widget
 PUT | /api/dashboards/:dashboardId/widgets/:id | Widget | Widget | update widget
 DELETE | /api/dashboards/:dashboardId/widgets/:id | - | - | delete widget

#### Widget
```javascript
{
    "id": 1, // no need when create a widget
    "type": 1, // the type of widget
    "dashboard_id": 1, 
    "config": {   // configuration
    	dataInfos: [
    		{
    			"id": 1
    		},
    		{
    			"id": 3,
    			"dimensions": [
    				"key": "course",
    				"name": "COURSE",
    				"value": "math"
    			]
    		}
    	]
    }
}
```
each type of widget has different config structure，refer to [Widget Type](https://github.com/yuantiku/flyboard/wiki/Widget-Type)

# API for User System

#### users

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/users/current | User | - | return current user who has logged in
 PUT | /api/users/salt_reset/:id | User | - | reset value of 'salt' field of user
 GET | /api/users/token/:id | token | - | return token of user
 GET | /api/users | User | - | return all users
 GET | /api/users/:id | User | - | get a user
 POST | /api/users | User | User | create a new user
 PUT | /api/users/:id | User | User | udpate user
 DELETE | /api/users/:id | - | - | delete user

### User
```javascript
{
    "id": 1, //no need when create a user
    "email": "abc@abs.com",
    "salt": "8sfdjUds3sdfa" //random string, system generates it automatically
}
```

### roles

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/roles | Role | - | return all roles
 GET | /api/roles/:id | Role | - | return a role
 POST | /api/roles | Role | Role | create a new role
 PUT | /api/roles/:id | Role | Role | update role
 DELETE | /api/roles/:id | - | - | delete role
 
### Role
```javascript
{
    "id": 1,  // no need when create a role
    "name": "admin",
    "scope": 2  // 2: global permissions, can operate any project
}
{
    "id": 3, // no need when create a role
    "name": "member",
    "scope": 2  // 1: local permissions, can only operate specified project
}
```

### user_role

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/user_roles | userRole | [user_id]: return all userRole of the user; [role_id]: return all userRoles of the role; [project_id]: return all userRoles of the project; | -
 GET | /api/user_roles/:id | userRole | - | return a userRole
 POST | /api/user_roles | userRole | userRole | create a userRole
 PUT | /api/user_roles/:id | userRole | userRole | update userRole
 DELETE | /api/user_roles/:id | - | - | delete userRole

### userRole

```javascript
{
    "id": 1,  // no need when create a userRole
    "user_id": 1,
    "role_id": 3,
    "project_id": 5  //if role has global permissions, the project_id must be 0, which means all projects can be operated; if role has local permissions, only the project specified by 'project_id' can be operated
}
```

### rolePrivileges

Method | URL | Return | Additional Params | Description
 --- | --- | --- | --- | ---
 GET | /api/role_privileges | rolePrivilege | [role_id]: return all rolePrivileges of the role; | return rolePrivileges
 POST | /api/role_privileges | rolePrivilege | rolePrivilege | create a new rolePrivilege
 DELETE | /api/role_privileges/:role_id | - | - | delete all rolePrivileges of the role

### RolePrivilege

```javascript
{
    "resource": "PROJECT",
    "operation": "GET",
    "role_id": 1
}
```
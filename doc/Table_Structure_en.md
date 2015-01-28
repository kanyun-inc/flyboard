## Visualization

### dashboards

Field | Type | Description
--- | --- | ---
id | integer |
name | string (notNull) | the name of dashboard
created_at | datetime |
updated_at | datetime |

### widgets

Field | Type | Description
--- | --- | ---
id | integer |
dashboard_id | integer (notNull) | id of the dashboard that the widget belongs to
type | integer (notNull) | the type of widget，eg. Spline is 1, Number is 4 ( refer to [Widget Type](https://github.com/yuantiku/flyboard/wiki/Widget-Type) )
config | text(JSON) (notNull)| widget configuration ( refer to [Widget Type](https://github.com/yuantiku/flyboard/wiki/Widget-Type) )

### projects

data_source and dashboard must belong to a project. data_sources and dashboards of different projects are not related.

Field | Type | Description
--- | --- | ---
id | integer |
name | string (notNull) | the name of project
created_at | datetime |
updated_at | datetime |
uuid | string (notNull, system auto generate) | unique id globally, system generates it automatically

### data_sources

Field | Type | Description
--- | --- | ---
id | integer |
project_id | integer (notNull) | id of the project that dataSource belongs to
name | string (notNull) |
key | string  (notNull) |
config | text(JSON) | configuration of dataSource, eg. dimensions ( refer to [DataSource: Multiple Dimension](https://github.com/yuantiku/flyboard/wiki/DataSource:-Multiple-Dimensions) )

### records

Field | Type | Description
--- | --- | ---
id | integer
data_source_id | integer (notNull) | id of the dataSource that record belongs to
value | integer (notNull) |
year | integer |
month | integer |
day | integer |
hour | integer |
minute | integer |
second | integer |
dim1 | string | 1st dimension, optional
dim2 | string | 2nd dimension, optional
dim3 | string | 3rd dimension, optional

## User System

### users

Field | Type | Description
--- | --- | ---
id | integer | 
email | string | based on passport module, the user system supports the third party platform account to log in, and the email is used to identify user
salt | string | random string, used to generate user's token

### roles

Field | Type | Description
--- | --- | ---
id | integer |
name | string |
scope | integer | can be 1 or 2. 2 represents global permission, 1 represents local permission.

### role_privilege

Field | Type | Description
--- | --- | ---
resource | string | only support 'Project' now
operation | string | can be 'GET', 'POST', 'PUT', 'DELETE'
role_id | integer | the role can do 'operation' to 'resource'. 

eg.
```
{
	resource: 'Project',
	operation: 'POST',
	role_id: 1
}
//means the role has permission to create a new project
```

### user_role

Field | Type | Description
--- | --- | ---
id | integer |
user_id | integer |
role_id | integer | the operations what the user can do is limited to the operations defined in table 'role_privilege'
project_id | integer | if role has global permission, set project_id to 1, which means the user can operate all projects; <br> otherwise, the user can only operate the specified project
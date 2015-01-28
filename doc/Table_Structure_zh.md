## 可视化

### dashboards

字段 | 类型 | 说明
--- | --- | ---
id | integer |
name | string (notNull) | dashboard的名称
created_at | datetime |
updated_at | datetime |

### widgets

字段 | 类型 | 说明
--- | --- | ---
id | integer |
dashboard_id | integer (notNull) | widget所属的dashboard的id
type | integer (notNull) | widget的类型，例，Spline（折线图）是1, Number（数字）是4 ( 参考 [Widget Type](https://github.com/yuantiku/flyboard/wiki/Widget-Type) )
config | text(JSON) (notNull)| widget的配置 ( 参考 [Widget Type](https://github.com/yuantiku/flyboard/wiki/Widget-Type) )

### projects

dataSource和和dashboard都必须属于一个project。不同project之间的dataSource和dashboard是没有关联的。

字段 | 类型 | 说明
--- | --- | ---
id | integer |
name | string (notNull) | project的名称
created_at | datetime |
updated_at | datetime |
uuid | string (notNull, system auto generate) | 全局唯一，系统自动生成

### data_sources

字段 | 类型 | 说明
--- | --- | ---
id | integer |
project_id | integer (notNull) | dataSource所属projct的id
name | string (notNull) |
key | string  (notNull) |
config | text(JSON) | dataSource的配置，例：维度信息( 参考 [DataSource: Multiple Dimension](https://github.com/yuantiku/flyboard/wiki/DataSource:-Multiple-Dimensions) )

### records

字段 | 类型 | 说明
--- | --- | ---
id | integer
data_source_id | integer (notNull) | record所属dataSource的id
value | integer (notNull) |
year | integer |
month | integer |
day | integer |
hour | integer |
minute | integer |
second | integer |
dim1 | string | 第1个维度，可选
dim2 | string | 第2个维度，可选
dim3 | string | 第3个维度，可选

## 用户系统

### users

字段 | 类型 | 说明
--- | --- | ---
id | integer |
email | string | 基于passport模块的用户系统采用第三方平台帐号登录，根据第三方提供的email来标识用户
salt | string | 随即字符串，用于生成user的token

### roles

字段 | 类型 | 说明
--- | --- | ---
id | integer |
name | string | 
scope | integer | 目前支持1，2两个数值。2代表全局权限，1代表局部权限

### role_privileges

字段 | 类型 | 说明
--- | --- | ---
resource | string | 目前只支持“Project”
operation | string | 可以是“GET”，“POST”，“PUT”，“DELETE”这4种操作
role_id | integer | 表示该role对于resource字段对应资源，可以进行operation字段所对应的操作

例：
```
{
	resource: 'Project',
	operation: 'POST',
	role_id: 1
}
//该role有权限创建一个新的Project
```

### user_role

字段 | 类型 | 说明
--- | --- | ---
id | integer |
user_id | integer |
role_id | integer | user的操作只限于该role在role_privilege中定义的operation
project_id | integer | 如果role拥有全局权限，则project_id设为0，user可以操作所有project；<br>否则，project_id设为某一个project的id，user只可以操作该project
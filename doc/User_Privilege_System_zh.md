## 用户系统

基于Passport模块（参考 [Passport doc] (http://passportjs.org/)），可支持多个三方平台帐号登录flyboard。例如，Google，Facebook等。

## 权限系统

### 概念

有4个重要的概念：**User**, **Role**, **RolePrivilege**, **UserRole**。

### User

第三方平台用户。

### Role

目前仅支持两种Role，全局和局部的。根据scope字段的值来区别，值为2 的表示全局role，值为1的表示局部role。

是否是全局role会影响user可以操作哪些project。具有全局role的用户可以操作所有project，而具有局部role的用户只能操作指定的project。

### RolePrivilege

表示具有该role的user可以进行哪些操作权限。

目前支持4种操作权限。

* **GET** 查看数据
* **POST** 新建数据
* **PUT** 修改数据
* **DELETE** 删除数据

通过在role_privilege表中添加多条记录，一个role可以具有多个操作权限。

### UserRole

表示user所具有的role。

如果role具有全局权限，project_id必须设为0，该user可以操作所有project。

```
{
	user_id: 1,
	role_id: 1,	// global
	project_id: 0
}
```

否则，如果role具有局部权限，需要指定project_id，user只可以操作指定的project。要让用户可以操作多个project，只需要在user_role表中添加多条记录即可。注意，这些记录中的role_id必须一致，因为一个user只能对应一个role。

```
{
	user_id: 3,
	role_id: 3,   // local
	project_id: 1
}
{
	user_id: 3,
	role_id: 3,
	project_id: 3
}
```
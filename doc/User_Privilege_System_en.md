## User System

Based on Passport module (refer to [Passport document](http://passportjs.org/) ), support multiple third-party platforms' account to log in. eg. Google, Facebook, etc.


## Privilege System

### Concept

There are 4 important concepts: **User**, **Role**, **RolePrivilge**, **UserRole**.

### User

the third-party platform account.

### Role

Only 2 kinds of roles are supported, global and local. The values of 'scope' field are 2 and 1 respectively.

Whether the role is global or not will affect which project the user can operate. User with global role can operate all projects, and user with local role can only operate specified projects.

### RolePrivilege

What kind of privileges the user with the role has.

4 kinds of privileges are supported now: 

* **GET** get data
* **POST** create data
* **PUT** update data
* **DELETE** delete data

By adding several data in table 'role_privilege', a role can have multiple privileges.

### UserRole

Which role the user has.

If the role has global permission, project_id must be set 0, and the user can operate all projects.

```
{
	user_id: 1,
	role_id: 1,	// global
	project_id: 0
}
```

Otherwise, if the role has local permission, project_id must be set a specified id. To allow user to operate multiple projects, adding several data to table 'user_role' will work. Be carefule that the role_id must be the same, because a user can only have one role.

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

#Concept
There are 5 important concepts: **Dashboard**, **Widget**, **DataSource**, **Record**, **Project**.

**Dashboard** and **Widget** are related with data visualization, **Dashboard** may include many widgets, and each **Widget** is a chart in fact.

**DataSource** and **Record** are related with data storage, **DataSource** represents a kind of data, **Record** represents real data for one DataSource.

```
                        project A
                   _________|________
                  |                  |
         dashboard 1			     dataSource 1
+------------+-------------+      _______|_______
|        ___ |      _      |     |   |   |       |
|     __/    |     |/|     |     r1  r2  r3  ...          
|    /       |     |/|     |     
|   /   _    |     |/|     |                     
|__/   / \__ |     |/|_    |                     
|_____/      |     |/| |   |                     
|            |     |/| |   |
+--------------------------+
   widget 1      widget 2
```
		 
#Module
Flyboard has the following modules.

```
+-----------------------------+                                                      
|                             |                                                      
|          Dashboard          |    <----- general user, access data
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|    Dashboard Configuration  |    <----- project manager, configure view
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|   Data Item Configuration   |    <----- developer, create, delete, edit dataSource
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|        Data Collector       |                                                      
|                             |                                                      
+-----------------------------+     
```


## View System

Visualize data in multiple types of chart. Most of the time, you just need this system to view the data.

This system shows one dashboard or several dashboards, which includes kinds of widgets, users can check data in widget. This is somewhat similar to the dashboard and widget in mac osx.

Click the title of widget to check detailed data. You can set period to view the data and trend that you want.
Besides, comparison of multiple dataSource is supported, for example, compare 'new user per day' and 'active user per day'. The data is displayed in form of spline and table both.

The system can have the concept of 'project', each project has its own dashboard. Thus, teams can share one system to display data of many projects.

## View Configuration System

Configure dashboard and widget. You can **create**, **edit**, and **delete** **widget** and **dashboard**.

Most of the time, Project Manager use it to configure a widget, selecting type of widget or choosing which dataSource to be displayed.

Flyboard has 5 types of widget, **Spline**, **Pie**, **Number**, **Donut**, **Column**. Besides, you can simply **drag** and **resize** widget to adjust layout of dashboard.

## Data Configuration System

Developers of the project will use this system to configure dataSource, then project managers use view configuration system to display the dataSource.

For the dataSource 'active user per day', the dataSource should be like this:

> project: ape  
> name: active user  
> id: activity.user  
> dimension: [year, month, day, client]

After create the dataSource, the API for posting a record will be like this, eg.
 ` curl -X POST -d '{"project": "ape", "id": "activity.user", "year": 2014, "month": 4, "day": 3, "client": "web" , "value": 100}' http://HOST_NAME:PORT/KEY`

## Data Collector

According to the configuration of dataSource, developers **push** the data into database.

### Data Collector Listener

Flyboard can update view system automatically when database operation events happen.

Based on socket IO, the server listens to operations related with database (post/update/remove record), and send notification to widget; widget received the event, and update itself according to detailed information of event.
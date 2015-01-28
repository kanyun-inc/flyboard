# 概念

Flyboard中有5个重要的概念：**Dashboard（仪表盘）**， **Widget（报表）**，**DataSource（数据源）**，**Record（记录）**，**Project（项目）**

**Dashboard** 和 **Widget**与展示数据有关。**Dashboard** 可以包含多个widgets, 一个**Widget**其实也就是一个报表。

**DataSource** 和 **Record**与数据存储有关，DataSource表示的是数据的类别，**Record**表示的是属于某一类别DataSource的具体的数据。


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

# 模块

Flyboard 基本上由以下主要模块组成。

```
+-----------------------------+                                                      
|                             |                                                      
|          Dashboard          |    <----- 前端用户访问，查看数据                                                     
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|    Dashboard Configuration  |    <----- 项目经理，配置数据项如何展示                                                  
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|   Data Item Configuration   |    <----- 开发人员，创建、删除、编辑数据项                                                  
|                             |                                                      
+-----------------------------+                                                      
|                             |                                                      
|        Data Collector       |                                                      
|                             |                                                      
+-----------------------------+     
```

## 报表查看系统

负责数据的呈现，大多数用户会只接触到这一部分来查看数据。

报表系统呈现给用户的是一个或者多个仪表板（dashboard），仪表盘上有各种挂件（widget），类似于 mac osx 的 dashboard 和 widget 关系。终端用户可以在这上面纵览产品的各项数据。

点击 widget 会进入该项统计数据的详细查看界面，可以选择时间段、时间间隔等等筛选条件来查看数据在一段时间内的走势。
数据详情查看页面还支持多数据项对比功能，例如可以对比每日新增用户量和每日活跃用户。数据同时以折线图和表格的形式呈现。

系统可以设置多个project，每个project中包含各自的dashboard，用于展示多个项目的数据。多个项目团队可以使用一个报表系统。

## 报表配置系统

负责报表的设置，在这个系统中，用户可以创建和编辑 dashboard，widget。

通常，项目经理会用到这一部分来选择数据项以及报表类型，配置出自己项目的 dashboard。

Flyboard 中可以添加各种 widget，widget 的类型有饼图、折线图、柱状图和数字。此外 widget 还可以通过拖动调整位置，以及设置大小。

## 数据配置系统

项目的开发人员会使用这套系统来配置dataSource（数据项）给项目经理来使用。

以每日活跃用户为例，需要配置的内容有：

> project: ape  
> name: active user  
> id: activity.user  
> dimension: [year, month, day, client]

完成配置后会给出一个 API 接口实例，例如: ` curl -X POST -d '{"project": "ape", "id": "activity.user", "year": 2014, "month": 4, "day": 3, "client": "web" , "value": 100}' http://HOST_NAME:PORT/KEY`

## 数据收集器

读取数据项的配置，以被动 push 的方式来收集数据，存储到数据库中

### 数据监听

当有关数据库的操作发生时，Flyboard能够自动刷新报表查看系统。

基于socket IO实现，服务器监听数据库操作（新增、更新、删除数据），并通知所有widget；widget接收到通知，并根据具体的事件信息，自动更新展示的数据。
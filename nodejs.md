### node.js和mongodb小demo环境设置

#### 步骤一、express搭建

   1.`express -e +项目名称`

2. 手动添加依赖："mongoose":"*"

   `cnpm i`

3. app.js 中手动添加监听端口`app.listen(80,function(){})`

   

   4.运行项目 `node app`

####步骤二、配置mongoose

1.连接数据库

```
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/news',function (err) {
  if (err) {
    throw err;
  }else {
    console.log("cg")
  }
});
```

2.定义骨架

```
var listSchema = mongoose.Schema({
  title: String,
  author:String,
  from:String,
  content:String,
  time:String,
  hits:Number

});
```

3.创建模型

```
var listModel = mongoose.model('list', listSchema);
```

#### 步骤三、添加功能

1.写一个静态页面add.html

```
<form action="/save_add.html" method="post">
    标题：<input type="text" name="title">
    作者：<input type="text" name="author">
    来源：<input type="text" name="from">
    内容：<textarea name="content" id="" cols="30" rows="10"></textarea>
    <input type="submit" value="提交">
</form>
```

2.在路由中设置跳转

```
router.post('/save_add.html',function (req,res,next) {
  var title=req.body.title;
  var author=req.body.author;
  var from=req.body.from;
  var content=req.body.content
  var list=new listModel();
  list.title=title;
  list.author=author;
  list.from=from;
  list.content=content;
  list.time=new Date().toLocaleString();
  list.hits=1;
  list.save(function () {
    res.send("发布成功")
  })
});
```

#### 步骤四、展示功能

1.设置一个路由

```
router.get('/newslist.html',function (req,res) {
  listModel.find().exec(function (err,data) {
    res.render('newslist.ejs',{list:data})
  })
});
```

2.设置一个ejs动态页面

```
<table>
    <thead>
    <tr>
        <th>标题</th>
        <th>作者</th>
        <th>来源</th>
        <th>发布时间</th>
        <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <%for(var i in list) {%>
    <tr>
        <td><%=list[i].title%></td>
        <td><%=list[i].author%></td>
        <td><%=list[i].from%></td>
        <td><%=list[i].time%></td>
        <td>
            <a href="/edit_news.html?id=<%=list[i].id%>">修改</a>
            <a href="/del_news.html?id=<%=list[i].id%>">删除</a>
        </td>
    </tr>
    <%}%>
    </tbody>
</table>
```

#### 步骤五、删除功能

1.在newslist.ejs页面删除<a>添加路径

```
<a href="/del_news.html?id=<%=list[i].id%>">删除</a>
```

2，设置删除路由

```
router.get('/del_news.html',function (req,res) {
  var id=req.query.id
  listModel.findById(id).exec(function (err,data) {
    data.remove(function () {
      res.send('<script>alert("删除成功");location.href="/newslist.html"</script>')
    })
  })
})
```

#### 步骤五、修改功能

1.在newslist.ejs页面修改<a>添加路径

```
<a href="/edit_news.html?id=<%=list[i].id%>">修改</a>
```

2.设置修改路由

 (1)根据id查找内容

```
router.get('/edit_news.html',function (req,res) {
  var id = req.query.id;
  listModel.findById(id).exec(function (err,data) {
    res.render("edit.ejs",{news:data});
  })
});
```

(2)新建动态页面edit.ejs来显示新闻内容

```
<form action="/save_edit" method="post">
    <input type="hidden" name="id" value="<%=news.id%>">
    标题：<input type="text" name="title" value="<%=news.title%>">
    作者：<input type="text" name="author" value="<%=news.author%>">
    来源：<input type="text" name="from" value="<%=news.from%>">
    内容：<textarea name="content" id="" cols="30" rows="10"><%=news.content%></textarea>
    <input type="submit" value="提交">
</form>
```

(3)提交之后设置修改路由

```
router.post('/save_edit',function (req,res) {
  var id = req.body.id;
  listModel.findById(id).exec(function (err,data) {
    data.title=req.body.title;
    data.author=req.body.author;
    data.from=req.body.from;
    data.content=req.body.content;
    data.time=new Date().toLocaleString();
    data.save(function () {
      res.send('<script>alert("修改成功");location.href="/newslist.html"</script>')
    })
  })
})
```


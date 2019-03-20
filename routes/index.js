var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/news',function (err) {
  if (err) {
    throw err;
  }else {
    console.log("cg")
  }
});

var listSchema = mongoose.Schema({
  title: String,
  author:String,
  from:String,
  content:String,
  time:String,
  hits:Number

});

var listModel = mongoose.model('list', listSchema);

//添加功能
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
//展示功能
router.get('/newslist.html',function (req,res) {
  listModel.find().exec(function (err,data) {
    res.render('newslist.ejs',{list:data})
  })
});
router.get('/del_news.html',function (req,res) {
  var id=req.query.id
  listModel.findById(id).exec(function (err,data) {
    data.remove(function () {
      res.send('<script>alert("删除成功");location.href="/newslist.html"</script>')
    })
  })
});
router.get('/edit_news.html',function (req,res) {
  var id = req.query.id;
  listModel.findById(id).exec(function (err,data) {
    res.render("edit.ejs",{news:data});
  })
});
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
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

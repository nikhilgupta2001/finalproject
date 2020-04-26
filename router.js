const router = require('express').Router();





router.get("/prevention",function(req,res){
  res.render("prevention");
});
router.get("/blogs",function(req,res){
  res.render("blogs");
});
router.get("/home",function(req,res){
  res.render("index");
});
router.get("/login",function(req,res){
  res.render("login");
})
router.get("/overview",function(req,res){
  res.render("overview");
});
router.get("/aboutus",function(req,res)
{
  res.render("aboutus");
})
router.get("/symptoms",function(req,res)
{
  res.render("symptoms");
})
router.get("/timeline",function(req,res)
{
  res.render("timeline");
})
router.get("/faq",function(req,res)
{
  res.render("faq");
})
router.get("/feedback",function(req,res)
{
  res.render("feedback");
})
router.get("/table",function(req,res)
{
  res.render("table");
})
router.get("/signup",function(req,res)
{
  res.render("signup")
}
)
router.post("/Login.html",function(req){
  const email=req.body.email;

  const data={
    members:[
     {
       email_address: email,
       status:"subscribed"

    }
   ]
  };
  const JSONData= JSON.stringify(data);
  const url="https://us19.api.mailchimp.com/3.0/lists/6b42b7ec91";
  const  options={
    method:"POST",
    auth:"sarvesh:3f650f61ed2eedcc99b087b42e1ce4b8-us19"
   }
 var request = https.request(url,options,function(response){
    console.log(response.statusCode);
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
   })

    request.write(JSONData);
    request.end();

});



module.exports = router;

var Test = require("../models/Test");
module.exports = function(app){
    app.get("/", function(req,res){
        res.render("layout");
    })

    app.post("/dangky", function(req,res){
        if(!req.body.Email || !req.body.Hoten || !req.body.SoToken){
            res.json({ketqua:0, maloi: "Thieu tham so kia ban oi!"});
        }else{
            var testNew = new Test({
                Email: req.body.Email,
                Hoten: req.body.Hoten,
                SoToken: req.body.SoToken,
                Vi: null,
                Ngay: Date.now()
            });
            testNew.save(function(err){
                if(err){
                    res.json({ketqua:0, maloi: "MongoDB save error!"+err});
                }else{
                    res.json({ketqua:1, maloi: testNew})
                }
            });
        }
    })
}
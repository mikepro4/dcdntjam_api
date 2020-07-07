var multer  = require('multer')
var upload = multer({ dest: 'static/' })
const cloudinary = require("cloudinary");
var mv = require('mv');
var fs = require('fs');

cloudinary.config({
		cloud_name: "dcdnt",
		api_key: "271692222816783",
		api_secret: "DhgKXiXYQqQj0nEB74w_70HfPWI"
});

module.exports = app => {
  app.post("/upload", function (req, res) {
		var file = req.files.file
		var newFileName = req.files.file.name.replace(/\s/g, '')

		var filePath = 'static/uploads/' + newFileName

		file.mv(filePath, function(err) {
			cloudinary.v2.uploader.upload_large(
				filePath,
				{ resource_type: "video" },
				function(error, result) {
					// console.log(result, error);
					fs.unlinkSync(filePath);
					return res.send({uploaded: "ok", result: result});
			});
	  });
  });
};

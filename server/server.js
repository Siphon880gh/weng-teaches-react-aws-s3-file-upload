const express = require("express");
const server = express();
const path = require("path");

// Configure multer to handle file uploads
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// const upload = multer({ dest: 'uploads/' }); // Otherwise you do fs.ReadFileSync to pass into s3 bucket body and there's no req.file.buffer

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'AKIA44_____FJOUNAB', 
  secretAccessKey: 'NuYATGQ_____/5AjVo_____kQXiLC'
});

// Boilerplate: Middleware to parse JSON fetch body and URL-encoded form data
// Boilerplate: Middleware to respond with static files after page is loaded
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "..", "client", "build")));

// server.use(fileUpload());

// Routes
server.post("/uploads", upload.single('file'), async (req, res) => {
    if(req.file === null) {
        return res.status(400).json({error: "No file uploaded from frontend"})
    }
    console.log({req_file: req.file})

    // Put object into AWS S3
    // Note the await form is: `await s3.putObject({...}).promise();`
    const s3 = new AWS.S3();
    s3.putObject({
      Bucket: 'weng-aws-s3',
      Key: 'image-name.png', 
    //   Body: imageFileBuffer,
      Body: req.file.buffer,
      ACL: 'public-read' 
    })
    .promise()
    .then(data=>{

        // Link would expire after 15mins
        // return s3.getSignedUrl("getObject", {
        //     Bucket: 'weng-aws-s3',
        //     Key: "image-name.png"
        // })

        return (function getUnsignedUrl() {
            let bucketName = "weng-aws-s3";
            let key = "image-name.png";
            const publicUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
            return publicUrl;
        })();
    }).then(url=>{
        res.send({url})
    })

});

server.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
});

async function startServer() {
    let port = process.env.PORT || 3001;

    server.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
}

startServer();
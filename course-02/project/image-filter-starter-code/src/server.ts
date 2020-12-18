import express,{Request,response,Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();
  var path = require('path'); 
  var validUrl = require('valid-url');
  const fs = require('fs');
  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.get( "/filteredimage",   ( req:Request, res:Response ) => {
    let { image_url } = req.query;
   
     if (!validUrl.isUri(image_url)){
       return res.status(401).send("Invalid image path");
    }
   
     new Promise( async resolve => {
      await filterImageFromURL(image_url);
      
    var options = { 
      root:  path.join( __dirname,"util","tmp")
  }; 
    
  var fileName ="filteredimage.jpg"; 

    res.sendFile(fileName, options, function (err) { 
      if (err) { 
        console.log(err); 
          res.send(err); 
      }
       else { 
            console.log('Sent:', fileName); 

            fs.readdir(path.join( __dirname,"util","tmp"), function (err:Error, files:string[]) {
              if (err) {
                  return console.log('Unable to scan directory: ' + err);
              }
          
              deleteLocalFiles(files);
              
          });

            } 
  }); 
    });

  
  
  


 });

  app.get( "/", async ( req, res ) => {
  
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
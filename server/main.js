import { Meteor } from 'meteor/meteor';
import { s3 } from 'meteor/lepozepo:s3';
import { Email } from 'meteor/email';
import { HTTP } from 'meteor/http';
import { Router } from 'meteor/iron:router';

Submissions = new Mongo.Collection('submissions');

var id = 1;

Meteor.startup(() => {
  // code to run on server at startup
  //console.log(Meteor.settings.s3.key);
  //console.log(S3);
  id = 1;
  
  S3.config = {
    key: Meteor.settings.s3.key,
    secret: Meteor.settings.s3.secret,
    bucket: Meteor.settings.s3.bucket,
    region: Meteor.settings.s3.region
  };
  
  console.log(S3.config.key);
  console.log(S3.config.secret);
  console.log(S3.config.bucket);
  
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
  
  console.log(process.env.MAIL_URL);
  
});

Meteor.methods({
  createSubmission: function (contentImageUrl, styleImagesUrl, email) {
    
    Submissions.insert({contentImageUrl: contentImageUrl, styleImagesUrl: styleImagesUrl, email: email});
    console.log("submission server side");
  },
  
  sendLinks: function(contentImageUrl, styleImagesUrl, email){
    
    console.log("sending links");
    HTTP.post( 'http://gpu.1lab.me/submitTask', {"data" :{ "idnum": id, "contentImg": contentImageUrl, "styleImg": styleImagesUrl, "email": email} }, function(error,response) {
        if(error){
          console.log("error in sending");
          console.log(error);
        } 
        
        console.log(response);
        id++;
    });
    
    /*HTTP.get('http://gpu.1lab.me', function(err, response){
      console.log(response);
    });*/
  }
});


Router.route( "/sendData", { where: "server" } )
  .post( function() {
    // If a POST request is made, create the user's profile.
    console.log(this.request.body);
    
    console.log(process.env.MAIL_URL);
    
    Email.send({
      from: "pumpkin3500@gmail.com",
      to: this.request.body.recipient,
      subject: "ART-ifact Image",
      text: "Your link to the product image: " + this.request.body.productImg
    });
  
    this.response.statusCode = 200;
    this.response.end("All is good");
  });
  




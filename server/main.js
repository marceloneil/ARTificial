import { Meteor } from 'meteor/meteor';
import { s3 } from 'meteor/lepozepo:s3';
import { Email } from 'meteor/email';

Submissions = new Mongo.Collection('submissions');

Meteor.startup(() => {
  // code to run on server at startup
  //console.log(Meteor.settings.s3.key);
  //console.log(S3);
  S3.config = {
    key: Meteor.settings.s3.key,
    secret: Meteor.settings.s3.secret,
    bucket: Meteor.settings.s3.bucket,
    region: Meteor.settings.s3.region
  };
  
  console.log(S3.config.key);
  console.log(S3.config.secret);
  console.log(S3.config.bucket);
  
  /*process.env.MAIL_URL = Meteor.settings.MAIL_URL;
  
  console.log(process.env.MAIL_URL);
  
  Email.send({
    from: "info@art-ificial.net",
    to: "kevin.shen18@yahoo.com",
    subject: "test",
    text: "Sample text"
  });*/
});

Meteor.methods({
  createSubmission: function (contentImageUrl, styleImagesUrl, email) {
    
    Submissions.insert({contentImageUrl: contentImageUrl, styleImagesUrl: styleImagesUrl, email: email});
    console.log("submission server side");
  }
});



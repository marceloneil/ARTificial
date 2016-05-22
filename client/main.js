import { Template } from 'meteor/templating';
import { s3 } from 'meteor/lepozepo:s3';
import { Email } from 'meteor/email';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import './main.html';

Template.s3_tester.events({
    //click button.upload
    "submit form": function(event, template){
        Session.set("hasFiles", true);
        console.log("button clicked");
        event.preventDefault();
        event.stopPropagation();
        //var file = template.find('input type=["file"]').files[0];
        //var files = template.$("input.file_bag")[0].files;
        //var file = $('input[type=file]')[0].files[0];
        //var file = template.find('#file').files[0];
        //var file = document.getElementById('file');
        //console.log(event.fpfile.url);
        //var file = $("#file")[0].files[0];
        console.log(JSON.stringify($("#file")));
        console.log($("#file"));
        
        var stylefiles = $("#stylefiles")[0].files;
        var contentfile = $("#contentfile")[0].files;
        
        console.log("file object: ",  stylefiles, JSON.stringify(stylefiles));
        //console.log("file object: ",  file[0]);
        //console.log("file object: ",  file[1]);
        //console.log("file being uploaded: " + JSON.stringify(file.name));
        //console.log("S3 config key: ", S3.config.key);
        
        var email = $('#email').val();
        var arrStyles = [];
        var count = 0;
        S3.upload({
                file: contentfile[0],
                path:""
        },function(e,r){
                console.log("file uploaded");
                console.log("error " + e);
                console.log(r);
                
                S3.upload({
                        files: stylefiles,
                        path:""
                },function(e,r2){
                        console.log("file uploaded");
                        console.log("error " + e);
                        console.log(r2);
                        
                        arrStyles.push(r2.secure_url);
                        count++;
                        
                        console.log(r.secure_url);
                        console.log(arrStyles.toString());
                        console.log(email);
                        
                        if(count >= stylefiles.length){
                            Meteor.call('createSubmission', r.secure_url, arrStyles, email, function(error) {
                                
                                    Meteor.call('sendLinks', r.secure_url, arrStyles, email, function(error){
                                        console.log(error);
                                        console.log("submission submitted");
                                        Session.set("hasFiles", false);
                                        $('.collection').remove();
                                        $('.collection-item').remove();
                                        Router.go('/end');
                                    });
                                    
                                
                            });
                        }
                 
                        
                });
                
                
        });
        
        
                
        
    }
});

Template.s3_tester.helpers({
    "files": function(){
        return S3.collection.find();
    }
});

Template.s3_tester.hasFiles = function(){
   // because the Session variable will most probably be undefined the first time
   
   return Session.get("hasFiles");
};

Router.route('/', function () {
  console.log("rendering s3_tester");
  this.render('s3_tester');
});

Router.route('/end', function () {
  
  this.render('end');
});




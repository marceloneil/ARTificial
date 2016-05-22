import { Template } from 'meteor/templating';
import { s3 } from 'meteor/lepozepo:s3';
import { Email } from 'meteor/email';
import { Router } from 'meteor/iron:router';
import './main.html';

Template.s3_tester.events({
    //click button.upload
    "submit form": function(event, template){
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
                        
                        
                        console.log(r.secure_url);
                        console.log(arrStyles.toString());
                        console.log(email);
                        
                        Meteor.call('createSubmission', r.secure_url, arrStyles, email, function(error) {
                                console.log(error);
                                console.log("submission submitted");
                            
                        });
                        
                 
                        
                });
                
                
                Router.go('/end');
                
        });
        
        
        
    }
});

Template.s3_tester.helpers({
    "files": function(){
        return S3.collection.find();
    }
});

Router.route('/', function () {
  console.log("rendering s3_tester");
  this.render('s3_tester');
});

Router.route('/end', function () {
  
  this.render('end');
});

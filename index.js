$("#create-event-image-upload-progress").hide();

/* Follow these instructions to get this web application to work:
  1. Create a Firebase project
  2. Add a web app from Firebase homepage then replace only the firebaseConfig variable (We took care of other things)
  3. In Firebase, get Started with Authentication then enable "Email/Password"
  4. In Firebase, get started with Cloud Firestore (Start in test mode so that you don't have to worry about security rules)
  5. Follow README.md instructions to run this application
 
// ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS END *************
*/

var firebaseConfig = {
  apiKey: "AIzaSyBEQnF5XxDL6bS9AupRLE_gC_l4HcpltOI",
  authDomain: "cis454project-866bc.firebaseapp.com",
  projectId: "cis454project-866bc",
  storageBucket: "cis454project-866bc.appspot.com",
  messagingSenderId: "833261976282",
  appId: "1:833261976282:web:673eb4007bce00c98b43e3",
  measurementId: "G-LFNLZCJW7Y"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

console.log(window.location.href);
// In index.html, if user tries to login with their email and password this function will execute. 
$("#loginButton").click(function () {
  var email = $("#loginEmail").val();
  var pass = $("#loginPassword").val();
  //console.log(email + " " + pass);

  if (email != "" && pass != "") {
    firebase.auth().signInWithEmailAndPassword(email, pass).catch((error) => {
      // for now we will just print error message. Later, we should user bootstrap form-validator.
      alert(error.message);
    });
  }
});


// once the user is logged in and presses signout button, this code will take them back to the sign in page(index.html)
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/index.html";
  }).catch((error) => {
    alert(error.message);
  });
}

// when a user creates an account, this function will get the infomations entered by the user then save those
// data in the firestore database in a collection named "users"
$("#signUpButton").click(async function () {

  const firstName = $("#firstName").val()
  const lastName = $("#lastName").val()
  const email = $("#signUpEmail").val()
  const password = $("#signUpPassword").val()
  const confirmpassword = $("#confirmSignUpPassword").val();

  // if (firstName.trim() == ""){
  //   $(firstName).addClass("is-invalid");
  // }s

  const allFilledOut = firstName.trim() != "" && lastName.trim() != "" && email.trim() != "" && password.trim() != "" && confirmpassword.trim() != "";

  if (allFilledOut) {
    if (password != confirmpassword) {
      // password did not match
      // $("#signUpPassword").addClass("is-invalid");
      // $("#confirmSignUpPassword").addClass("is-invalid");
      alert("password didn't match")
    } else {

      await firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
        const currentUid = firebase.auth().currentUser.uid;
        const signUpData = {
          "firstName": firstName,
          "lastName": lastName,
          "createdDate": firebase.firestore.Timestamp.now(),
          "uid": firebase.auth().currentUser.uid,
          "email": email
        }

        const db = firebase.firestore();
        await db.collection('users').doc(currentUid).set(signUpData).catch(function (error) {
          alert("Error uploading user Data:" + error.message)
        });
        window.location.href = "/homepage.html";

      }).catch((error) => {
        alert(error.message);
      });



    }




  }

});

// when a user creates an event, the event data with the event picture will be extracted then it will be uploaded to the
// database.
$(document).on('click', '#createEventSubmit', function () {
  const eventName = $("#create-event-name").val()
  const eventLocation = $("#create-event-location").val()
  const eventCapacity = $("#create-event-capacity").val()
  const eventDate = $("#create-event-date").val()
  const eventTime = $("#create-event-time").val();
  const eventContactNumber = $("#create-event-contact").val();
  const eventDescription = $("#create-event-description").val();
  const eventImage = $("#create-event-image").prop("files")[0]

  const str = eventName + "-" + eventLocation + "-" + eventCapacity + "-" + eventDate + "-" + eventTime + "-" + eventContactNumber + "-" + eventDescription + "-";

  if (eventName.trim() == "" || eventLocation.trim() == "" || eventCapacity == "" || eventDate == "" || eventTime == "" || eventContactNumber.trim() == "" || eventDescription.trim() == "") {
    alert("No fields can be empty");

    alert(eventDate + " " + eventTime)


  } else if (eventImage == null) {
    alert("Pick an event picture");
    console.log(str)
  } else {
    // upload event to the database

    const userId = firebase.auth().currentUser.uid
    if (userId == "") { // checking if user is still logged in. If not take them sign in page(index.js)
      window.location.href = "index.html"
    }

    const db = firebase.firestore();

    const time = new Date()
    const storageRef = firebase.storage().ref() // firestore reference
    const fileName = time.getTime() + "_" + eventImage.name

    // upload picture to storage
    const uploadTask = storageRef.child("eventPictures/" + fileName).put(eventImage)
    $("#create-event-image-upload-progress").show()

    // it will first upload the image to Firestorage. (This returns the image url)
    // Then use the image url to update users' profile picture
    // Documentation: https://firebase.google.com/docs/storage/web/upload-files
    uploadTask.on("state_changed",
      function (snapshot) {
        //about upload status
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)

        $("#create-event-image-upload-progress").attr("style", "width:" + percent + "%")
        if (percent == 100) {
          $("#create-event-image-upload-progress").html("Successfully Uploded image!")

        } else {
          $("#create-event-image-upload-progress").html(percent + "%")
        }

      },
      function (error) {
        // if error
        alert("Theres an error uploading your image. Error Message:" + error.message)
      }, async function () {
        // if successful

        uploadTask.snapshot.ref.getDownloadURL().then(async function (downloadUrl) {
          // after we have the download url of the picture


          const eventData = {
            "eventName": eventName,
            "eventLocation": eventLocation,
            "eventCapacity": eventCapacity,
            "eventDateAndTime": firebase.firestore.Timestamp.fromDate(new Date(eventDate + " " + eventTime)),
            "eventContactNumber": eventContactNumber,
            "eventDescription": eventDescription,
            "eventImage": downloadUrl,
            "availableSeats": eventCapacity,
            "eventCreatedDate": firebase.firestore.Timestamp.now(),
            "owner": userId
          }

          await db.collection('events').doc().set(eventData).catch(function (error) {
            alert("Error uploading user Data:" + error.message)
          });
          // after updating the profile picture go to home page
          window.location.href = "homepage.html"
        })
      }
    )
  }
});





// login and sign up form validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})();

// when a user edit their personal information this code will help replace extisting firestore data with newly entered data.
$(document).ready(function () {
  $("#saveEditedProfileInfo").click(async function () {
    const username = $("#change-username").val()
    const firstName = $("#change-first-name").val()
    const lastName = $("#change-last-name").val();
    const birthday = $("#changeBithday").val();

    const gender = $("input[type='radio'][name='inlineRadioOptions']:checked").val();


    if (username.trim() == "" || firstName.trim == "" || lastName.trim() == "" || birthday == "") {
      alert("all fields must be filled")
      //console.log(username + " " + firstName + " " + lastName + + " " + birthday + " " +  gender)
    } else {
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid

      const updatedProfileData = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "gender:": gender,
        "birthday": firebase.firestore.Timestamp.fromDate(new Date(birthday)),
      }

      await db.collection('users').doc(userId).update(updatedProfileData).catch(function (error) {
        alert("Error uploading user Data:" + error.message)
      });
      window.location.href = "homepage.html"
    }


  });

});


// Reset Password
// This code will send an password reset email.
$("#resetPwd").click(function (e) {

  const email = $("#resetPwdEmail").val()

  if (email != "") {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      alert("Password reset email sent. It may take up to 5 minutes to receive it. Please check your email to verify.")
      window.location.replace("index.html")
    }).catch(function (error) {
      alert(error.message)
    })
  } else {
    alert("Email field can't be empty")
  }
});

// Update Password
$(function () {
  $("#change-password-button").click(function (e) {
    var emailaddress = $("#change-password-email").val()
    var oldpassword = $("#change-password-oldpassowrd").val()
    var newpassword1 = $("#change-password-newpassword-1").val()
    var newpassword2 = $("#change-password-newpassword-2").val()

    if (newpassword1 == newpassword2) {
      firebase.auth()
        .signInWithEmailAndPassword(emailaddress, oldpassword)
        .then(function (user) {
          firebase.auth().currentUser.updatePassword(newpassword1).then(function () {
            alert("success")
            logout()
          }).catch(function (err) {
            alert(err)
          });
        }).catch(function (err) {
          alert(err)
        });
    } else {
      alert("new password must be same")
    }



  })
});

// Update email address
$(function () {
  $("#change-email-button").click(function (e) {
    var oldemail = $("#change-email-oldemail").val()
    var oldpassword = $("#change-email-oldpassword").val()
    var newemail = $("#change-email-newemail").val()


    firebase.auth()
      .signInWithEmailAndPassword(oldemail, oldpassword)
      .then(function (user) {
        firebase.auth().currentUser.updateEmail(newemail).then(function () {
          alert("success")
          logout()
        }).catch(function (err) {
          alert(err)
        });
      }).catch(function (err) {
        alert(err)
      });

  })
});


// When a user tries to join an event the code below will check if they have already joined the event.
// If they have not joined the event then extact users data with event information and save it in a different collection.
// The different collection will later be used by the event owner to accept or reject the join request.
async function joinEvent(eventId,eventOwnerId,eventName){
  //alert("Joining..." + eventId +" "+ eventOwnerId)

  const db = firebase.firestore();
  const userId = firebase.auth().currentUser.uid

  const querySnapshot = await db.collection('eventRequests').doc(eventOwnerId).collection("requests")
  .where("requesterId", "==",userId).where("eventId", "==", eventId).get();

  // console.log(querySnapshot);
  // console.log(querySnapshot.size);
  // console.log(querySnapshot.empty);

  if (!querySnapshot.docs.length == 0){
    alert("Request already sent!");
  } else {

    const userDoc = await db.collection('users').doc(userId).get();
    const userDocData = userDoc.data();

    const request = {
      "eventOwner": eventOwnerId,
      "eventId": eventId,
      "eventName":eventName,
      "requesterId": userId,
      "requesterEmail": userDocData.email,
      "requesterName": userDocData.firstName + ' ' + userDocData.lastName,
      "requestedDate": firebase.firestore.Timestamp.now(),
    }
  
    await db.collection('eventRequests').doc(eventOwnerId).collection("requests").doc().set(request).catch(function (error) {
      alert("Error joining event:" + error.message)
    });
    alert("Event join request sent");
  }
}


// Editing Event
$(document).ready(function () {
  $("#editEventSubmit").click(async function () {
    const eventname = $("#edit-event-name").val()
    const eventlocation = $("#edit-event-location").val();
    const eventCapacity = $("#edit-event-capacity").val();
    const eventDate = $("#edit-event-date").val()
    const eventTime = $("#edit-event-time").val()
    const eventContactNumber = $("#edit-event-contact").val();
    const eventDescriptions = $("#edit-event-description").val();

    if (eventname.trim() == "" || eventDate.trim() == "" || eventlocation.trim() == "" || eventTime.trim() == "" || eventCapacity.trim() == "" || eventContactNumber.trim() == "" || eventDescriptions.trim() == "") {
      alert("all fields must be filled")
      //console.log(username + " " + firstName + " " + lastName + + " " + birthday + " " +  gender)
    } else {
      const db = firebase.firestore();

      const profileParam = new URLSearchParams(window.location.search);
      const docId = profileParam.get('docId');// extract uid from URI

    //  alert("alert(docId)"+docId)
      
      const eventDoc = await db.collection('events').doc(docId).get().catch(function (error) {
        alert("Error uploading user Data:" + error.message )
        alert(docId)
       // window.location.href = "homepage.html";
      });

      const eventDocData = eventDoc.data();

      const currentUserId = firebase.auth().currentUser.uid

//      console.log(eventDoc.id);
      alert("alert(eventDoc)"+eventDocData.owner + "userIdf "+currentUserId) 
      if (eventDocData.owner !== currentUserId){
        window.location.href = "homepage.html";
      }

      const updatedEventData = {
        "eventName": eventname,
        "eventLocation": eventlocation,
        "eventCapacity": eventCapacity,
        "eventDateAndTime": firebase.firestore.Timestamp.fromDate(new Date(eventDate + " " + eventTime)),
        "eventContactNumber": eventContactNumber,
        "eventDescription": eventDescriptions,
        "availableSeats": eventCapacity,
        "eventUpdatedDate": firebase.firestore.Timestamp.now(),
      }

      await db.collection('events').doc(eventDoc.id).update(updatedEventData).catch(function (error) {
        alert("Error uploading user Data:" + error.message)
      });
      window.location.href = "homepage.html"
    }
  });

});

// helper function for going to correct edit event page url.
function goToeditEventPage(owner,docId){
  window.location.href = "/edit-event1.html?owner=" + owner + '&docId=' + docId;
}

// helper function for accepting for rejecting the join request
async function handleRequest(accepted, requestDoc){

  var docData = requestDoc.data();

  docData.joinedDate = firebase.firestore.Timestamp.now();
  const db = firebase.firestore();
  // if accepted
  if (accepted == true){
    await db.collection('events').doc(docData.eventId).collection("joined").doc().set(docData);
  }

  await requestDoc.ref.delete();

}

// Edit Event Existing
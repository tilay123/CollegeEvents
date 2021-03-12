var firebaseConfig = {
  apiKey: "AIzaSyDhMRBPlcNtNUE6YrrE99YdF8i_r0Lw0YI",
  authDomain: "collegeeventsv2.firebaseapp.com",
  projectId: "collegeeventsv2",
  storageBucket: "collegeeventsv2.appspot.com",
  messagingSenderId: "651170916635",
  appId: "1:651170916635:web:81125aedf0a35ad60ecbbe",
  measurementId: "G-8P2SDKXDCR"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

console.log(window.location.href);
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


function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/index.html";
  }).catch((error) => {
    alert(error.message);
  });
}

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
})()
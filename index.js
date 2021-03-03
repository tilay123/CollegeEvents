var firebaseConfig = {
    apiKey: "AIzaSyCW09TRZGMiUCe_o2IsOZJwUw8ODxelHzY",
    authDomain: "collegeevents-958cc.firebaseapp.com",
    projectId: "collegeevents-958cc",
    storageBucket: "collegeevents-958cc.appspot.com",
    messagingSenderId: "276764470343",
    appId: "1:276764470343:web:64d68d48a4d606baa1d562",
    measurementId: "G-7TTWYCQCF0"
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


  $("#logOutButton").click(function () {
    firebase.auth().signOut().then(()=> {
      window.location.href = "/index.js";
    }).catch((error)=>{
      alert(error.message);
    });
  });

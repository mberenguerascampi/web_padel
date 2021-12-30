const BASE_URL = "https://us-central1-accesscontrol-f2410.cloudfunctions.net/";
const EDIT_USER_URL = BASE_URL + "editUser";

var Login = new Vue ({
	el: "#loginPopup",
	data: {
		email: "",
		password: "",
		passwordRepeat: "",
		name: "",
		phone: "",
		errorMsg: "",
		signUpErrorMsg: "",
		loginTitle: "Inicia la sessió",
		displayEmailForm: true,
		displaySignUpForm: false
	},
	methods: {
		signIn: function () {
			this.errorMsg = "";
			var self = this;
		  	firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function() {
		      var url = window.location.origin + "/reserves.html";
      		  window.location = url;
		    })
		    .catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  self.errorMsg = error.message;
			  // ...
			});
	    },
	    passwordRecovery: function () {
	    	this.loginTitle = "Recupera la contrasenya";
			this.displayEmailForm = false;
	    },
	    cancelPasswordRecovery: function () {
	    	this.loginTitle = "Inicia la sessió";
			this.displayEmailForm = true;
	    },
	    sendPasswordRecovery: function () {
			firebase.auth().sendPasswordResetEmail(this.email).then(function() {
		      // Password reset email sent.
		    })
		    .catch(function(error) {
		      // Error occurred. Inspect error.code.
		    });
	    },
	    showSignUpForm: function () {
	    	this.loginTitle = "Registra't";
			this.displaySignUpForm = true;
	    },
	    signUp: function () {
	    	if(this.password !== this.passwordRepeat){
	    		this.signUpErrorMsg = "Els passwords no coincideixen";
	    		return;
	    	}

			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(() => {
				firebase.auth().currentUser.getIdToken(true).then((idToken) => {
					var userData = {"displayName": this.name, "phone": this.phone, "email": this.email}
				  	// Send token to your backend via HTTPS
					$.ajax({
					  type: "POST",
					  url: EDIT_USER_URL,
					  headers: {"Authorization" : "Bearer " + idToken},
					  data: userData,
					  success: function(res) {
					  	var url = window.location.origin + "/reserves.html";
      		  			window.location = url;
					  },
					  error: function(err) {
					  	console.log(err)
					  	this.signUpErrorMsg = "S'ha produït un error";
					  },
					  dataType: "application/json"
					});
				}).catch((error) => {
			 		console.log(error)
				});
			}).catch((error) => {
			    console.log(error)
				// Handle Errors here.
				var errorCode = error.code;
				this.signUpErrorMsg = error.message;
			});
	    },
	    cancelSignUp: function () {
	    	this.loginTitle = "Inicia la sessió";
			this.displaySignUpForm = false;
	    },
	    errorLabelDisplay: function(){
			return (this.errorMsg != "");
		},
	}
});

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}



var updateInstrSize = function(){
	var intrWidth = parseInt($(".img-instructions").css("width").replace("px",""));
    $(".img-instructions").css("height", Math.round(intrWidth*0.5625));
}

$(window).on('resize', function(){
    updateInstrSize();
});

$(document).ready(function() {
	updateInstrSize();
	window.dragMoveListener = dragMoveListener;
});
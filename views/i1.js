var userlogin = document.getElementById("userlogin"),
    passwordlogin = document.getElementById("passwordlogin"),
    login = document.getElementById("login"),
    createBtn = document.getElementById("create"),
    loginDiv = document.getElementById("loginout"),
    newuser = document.getElementById("newuser"),
    newpw = document.getElementById("newpw"),
    confirmpw = document.getElementById("confirmpw"),
    acctDiv = document.getElementById("createacc"),
    submitbutton = document.getElementById("submitbutton"),
    cancelBtn = document.getElementById("cancelBtn");


document.getElementById("create").addEventListener("click", function (){
    document.getElementById("createacc").style.display = "block";
    loginFadeOut();
    setTimeout(function(){
        acctFadeIn()}, 1000)
});


document.getElementById("submitbutton").addEventListener("click", function(){
    loginDiv.style.display = "block";
    acctFadeOut();
    setTimeout(function(){
        loginFadeIn()}, 1000)
});

document.getElementById("cancelBtn").addEventListener("click", function(){
    loginDiv.style.display = "block";
    acctFadeOut();
    setTimeout(function(){
        loginFadeIn()}, 1000)
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            /*var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "/login", true);
            xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText)
                }
            };
            xmlhttp.send(`longitude=${position.coords.longitude}&latitude=${position.coords.latitude}`);
            latitude = position.coords.latitude
            longitude = position.coords.longitude*/
            document.getElementById('long').value = position.coords.longitude
            document.getElementById('lat').value = position.coords.latitude
            console.log('success');
        });
}};
getLocation();

function loginFadeIn(){
    uName.style.left ="0px";
    uName.style.opacity = 1;
    uPassword.style.left = "0px";
    uPassword.style.opacity = 1;
    login.style.left = "0px";
    login.style.opacity = 1;
    createBtn.style.opacity = 1;
}


function loginFadeOut(){
    uName.style.left ="150px";
    uName.style.opacity = 0;
    uPassword.style.transitionDelay ="0.2s";
    uPassword.style.left = "150px";
    uPassword.style.opacity = 0;
    login.style.transitionDelay = "0.4s";
    login.style.left = "150px";
    login.style.opacity = 0;
    createBtn.style.opacity = 0;
    setTimeout(function(){
        loginDiv.style.display = "none";}, 1000)
    }


function acctFadeIn(){
    acctDiv.style.display = "block";
    nUser.style.left = "0px";
    nUser.style.opacity = 1;
    nEmail.style.transitionDelay = "0.2s";
    nEmail.style.left = "0px";
    nEmail.style.opacity =1;
    nPassword.style.transitionDelay = "0.4s";
    nPassword.style.left = "0px";
    nPassword.style.opacity = 1;
    cPassword.style.transitionDelay = "0.6s";
    cPassword.style.left = "0px";
    cPassword.style.opacity = 1;;
    submitbutton.style.transitionDelay = "0.8s";
    submitbutton.style.left = "0px";
    submitbutton.style.opacity = 1;
    cancelBtn.style.opacity = 1;
}

function acctFadeOut(){
    nUser.style.left = "-150px";
    nUser.style.opacity = 0;
    nEmail.style.left = "-150px";
    nEmail.style.opacity = 0;
    nPassword.style.left = "-150px";
    nPassword.style.opacity = 0;
    cPassword.style.left = "-150px";
    cPassword.style.opacity = 0;
    submitbutton.style.left = "-150px";
    submitbutton.style.opacity = 0;
    cancelBtn.style.opacity = 0;
    setTimeout(function(){
        document.getElementById("createacc").style.display = "none";}, 1000)
}


var current = 0,
slides = document.getElementsByClassName("bg");

setInterval(function() {
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.opacity = 0;
  }
  current = (current != slides.length - 1) ? current + 1 : 0;
  slides[current].style.opacity = 1;
}, 5000);



function shortusername(username){
    if(username === 1){
        swal('Username must be 3-12 characters long')
    } else if (username === 2){
        swal('Username already exists')
    } else if (username === 3){
        swal("Incorrect Username or Password")
    } else if (username === 4){
        swal("Passwords do not match")
    } else if (username === 5){
        swal("Password needs to be at least 5 characters")
    } else if (username === 6){
        swal("Username may not contain spaces or special characters")
    } else if (username === 0){
        swal('Congratulations you have successfully created an account')
    } else if (username === 7){
        swal('Incorrect password or account doesnt exist')
    }
};


// var saveList = (location) => {
// 	var xmlhttp = new XMLHttpRequest();
//     xmlhttp.open("POST","/storeuserdata", true);
//     xmlhttp.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
//     xmlhttp.onreadystatechange = () =>{
//         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//             console.log(xmlhttp.responseText)
//         }
//     };
//     xmlhttp.send(`location=${location}`);
// };





//document.getElementById("x").addEventListener("click",function(){
//    document.getElementById("mainpage").style.display = "none";
//    document.getElementById("mainpage2").style.display = "none";
//})


// var LoginInput = document.getElementById('usertxt'),
//     PassInput = document.getElementById('passwordtxt'),
//     //NEED TO MAKE PASSWORD <input type='password'>
//     LoginBut = document.getElementById('login'),
//     MakeUsrBut = document.getElementById('submit'),

//     NewUsrInput = document.getElementById('newuser'),
//     NewUsrPass = document.getElementById('newpw'),
//     ConfirmPass = document.getElementById('confirmpw')


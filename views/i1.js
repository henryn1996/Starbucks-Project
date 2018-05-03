var userlogin = document.getElementById("userlogin"),
    passwordlogin = document.getElementById("passwordlogin"),
    login = document.getElementById("login"),
    createBtn = document.getElementById("create"),
    loginDiv = document.getElementById("loginout"),
    newuser = document.getElementById("newuser"),
    newpw = document.getElementById("newpw"),
    confirmpw = document.getElementById("confirmpw"),
    acctDiv = document.getElementById("createacc"),
    submitbutton = document.getElementById("submitbutton");


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


function loginFadeIn(){
    userlogin.style.left = "0px";
    userlogin.style.opacity = 1;
    passwordlogin.style.left = "0px";
    passwordlogin.style.opacity = 1;
    login.style.left = "0px";
    login.style.opacity = 1;
    createBtn.style.opacity = 1;
}


function loginFadeOut(){
    userlogin.style.left = "150px";
    userlogin.style.opacity = 0;
    passwordlogin.style.transitionDelay = "0.2s";
    passwordlogin.style.left = "150px";
    passwordlogin.style.opacity = 0;
    login.style.transitionDelay = "0.4s";
    login.style.transitionDuration = "2s";
    login.style.left = "150px";
    login.style.opacity = 0;
    createBtn.style.opacity = 0;
    setTimeout(function(){
        loginDiv.style.display = "none";}, 3000)
    }


function acctFadeIn(){
    acctDiv.style.display = "block";
    newuser.style.left = "0px";
    newuser.style.opacity = 1;
    newpw.style.transitionDelay = "0.2s"
    newpw.style.left = "0px";
    newpw.style.opacity = 1;
    confirmpw.style.transitionDelay = "0.4s";
    confirmpw.style.left = "0px";
    confirmpw.style.opacity = 1;
    submitbutton.style.transitionDelay = "0.6s";
    submitbutton.style.left = "0px";
    submitbutton.style.opacity = 1;
    submitbutton.style.transitionDelay = "0s"
}

function acctFadeOut(){
    newuser.style.left = "-150px";
    newuser.style.opacity = 0;
    newpw.style.left = "-150px";
    newpw.style.opacity = 0;
    confirmpw.style.left = "-150px";
    confirmpw.style.opacity = 0;
    submitbutton.style.left = "-150px";
    submitbutton.style.opacity = 0;
    setTimeout(function(){
        document.getElementById("createacc").style.display = "none";}, 3000)
}





var images = ['1',
			  '2',
			  '3',
			  '4',
			  '5'],
			  bgIndex = 0;
			  imgDuration = 3000;

setInterval(function(){
	var url = images[Math.floor(Math.random()*images.length)]
	document.getElementById("bg").style.backgroundImage = "url(bgImg/bg"+url+".jpg)";
}, 4000);


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


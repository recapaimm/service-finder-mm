document.addEventListener(
"DOMContentLoaded",
function(){


const form =
document.getElementById(
"providerLoginForm"
);


const btn =
document.getElementById(
"providerLoginBtn"
);


const message =
document.getElementById(
"providerLoginMessage"
);



function showMessage(text,type){

message.textContent = text;

message.className =
"provider-auth-message show " + type;

}



if(!form) return;



form.addEventListener(
"submit",
async function(e){

e.preventDefault();



const email =
document
.getElementById("providerEmail")
.value
.trim();



const password =
document
.getElementById("providerPassword")
.value;



if(!email || !password){

showMessage(
"Email နှင့် Password ဖြည့်ပါ",
"error"
);

return;

}



btn.disabled=true;

btn.textContent="ဝင်နေပါသည်...";



try{


// LOGIN

const {
data,
error
}=

await supabaseClient.auth.signInWithPassword({

email:email,

password:password

});



if(error)
throw error;



const user =
data.user;



if(!user){

throw new Error(
"Account မတွေ့ပါ"
);

}




// CHECK PROFILE

const {

data:profile,

error:profileError

}

=

await supabaseClient

.from("profiles")

.select("*")

.eq("id",user.id)

.single();



if(profileError){

throw profileError;

}





// CHECK ROLE

if(profile.role !== "provider"){


throw new Error(
"ဒီ Account သည် ဆိုင်သမား Account မဟုတ်ပါ"
);


}




// CHECK STATUS


if(profile.status === "pending"){


showMessage(
"⏳ Admin မှ စစ်ဆေးနေဆဲ ဖြစ်ပါတယ်။ အတည်ပြုပြီးမှ ဝင်နိုင်ပါမည်။",
"error"
);


await supabaseClient.auth.signOut();

return;


}




if(profile.status === "rejected"){


showMessage(
"❌ သင့်ဆိုင်စာရင်းကို ပယ်ချထားပါတယ်။",
"error"
);


await supabaseClient.auth.signOut();

return;


}




if(profile.status === "approved"){



showMessage(
"✅ Login အောင်မြင်ပါပြီ",
"success"
);



setTimeout(
function(){

window.location.href =
"provider-dashboard.html";


},
1500
);



}



}
catch(error){


console.error(
"Login error:",
error
);



showMessage(
"❌ " + error.message,
"error"
);



}
finally{


btn.disabled=false;

btn.textContent="ဝင်မယ်";


}



}

);


});

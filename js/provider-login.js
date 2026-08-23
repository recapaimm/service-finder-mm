document.addEventListener(
"DOMContentLoaded",
function(){

const form =
document.getElementById("providerRegisterForm");


const btn =
document.getElementById("providerRegisterBtn");


const message =
document.getElementById("providerRegisterMessage");



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



const fullName =
document.getElementById(
"providerFullName"
).value.trim();



const shopName =
document.getElementById(
"providerShopName"
).value.trim();



const phone =
document.getElementById(
"providerPhone"
).value.trim();



const email =
document.getElementById(
"providerEmail"
).value.trim();



const category =
document.getElementById(
"providerCategory"
).value;



const address =
document.getElementById(
"providerAddress"
).value.trim();



const password =
document.getElementById(
"providerPassword"
).value;



const confirmPassword =
document.getElementById(
"providerConfirmPassword"
).value;



if(
!fullName ||
!shopName ||
!phone ||
!email ||
!category ||
!address ||
!password
){

showMessage(
"အချက်အလက်အားလုံးဖြည့်ပါ",
"error"
);

return;

}



if(password.length < 6){

showMessage(
"Password အနည်းဆုံး 6 လုံးထားပါ",
"error"
);

return;

}



if(password !== confirmPassword){

showMessage(
"Password မတူပါ",
"error"
);

return;

}



btn.disabled=true;

btn.textContent="စာရင်းသွင်းနေပါသည်...";



try{


// CREATE AUTH USER

const {
data,
error
}=

await supabaseClient.auth.signUp({

email,

password,

options:{

data:{

full_name:fullName,

phone,

shop_name:shopName,

category,

address

}

}

});



if(error)
throw error;



if(!data.user){

throw new Error(
"Account ဖန်တီးမရပါ"
);

}



// SAVE PROFILE

const {
error:profileError
}

=

await supabaseClient
.rpc(
"register_provider",
{

p_full_name:fullName,

p_phone:phone,

p_shop_name:shopName,

p_category:category,

p_address:address

}

);



if(profileError)
throw profileError;



showMessage(
"✅ ဆိုင်စာရင်းသွင်းအောင်မြင်ပါပြီ။ Admin စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။",
"success"
);



form.reset();



setTimeout(
()=>{

window.location.href=
"login.html";

},
3000
);



}
catch(error){


console.error(error);


showMessage(
"❌ "+error.message,
"error"
);


}
finally{

btn.disabled=false;

btn.textContent=
"🏪 ဆိုင်စာရင်းသွင်းမယ်";

}



}

);


});

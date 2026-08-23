// ========================================
// PROVIDER REGISTER
// ========================================

document.addEventListener(
"DOMContentLoaded",
function(){


const form =
document.getElementById(
"providerRegisterForm"
);


const button =
document.getElementById(
"providerRegisterBtn"
);


const message =
document.getElementById(
"providerRegisterMessage"
);



function showMessage(text,type){

if(!message) return;

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
!password ||
!confirmPassword
){

showMessage(
"အချက်အလက်အားလုံး ဖြည့်ပေးပါ။",
"error"
);

return;

}




if(password.length < 6){

showMessage(
"Password အနည်းဆုံး 6 လုံးရှိရပါမယ်။",
"error"
);

return;

}



if(password !== confirmPassword){

showMessage(
"Password နှစ်ခု မတူပါ။",
"error"
);

return;

}




button.disabled=true;

button.textContent=
"⏳ စာရင်းသွင်းနေပါသည်...";




try{


// ===============================
// CREATE AUTH ACCOUNT
// ===============================


const {
data,
error
}=

await supabaseClient.auth.signUp({

email:email,

password:password,


options:{

data:{

full_name:fullName,

phone:phone,

shop_name:shopName,

category:category,

address:address

}

}

});



if(error)
throw error;



if(!data.user){

throw new Error(
"Account ဖန်တီး၍ မရပါ။"
);

}




// ===============================
// SAVE PROVIDER PROFILE
// ===============================


const {
error:rpcError
}

=

await supabaseClient.rpc(
"register_provider",
{

p_full_name:fullName,

p_phone:phone,

p_shop_name:shopName,

p_category:category,

p_address:address

}

);



if(rpcError)
throw rpcError;




showMessage(
"✅ ဆိုင်စာရင်းသွင်းအောင်မြင်ပါပြီ။ Admin စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။",
"success"
);



form.reset();



setTimeout(
function(){

window.location.href =
"login.html";

},
3000
);



}
catch(error){


console.error(
"Provider Register Error:",
error
);



showMessage(
"❌ " + error.message,
"error"
);



}
finally{


button.disabled=false;

button.textContent=
"🏪 ဆိုင်စာရင်းသွင်းမယ်";


}



}

);


});

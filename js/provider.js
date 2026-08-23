// ========================================
// PROVIDER REGISTRATION
// ========================================

const providerRegisterForm =
    document.getElementById("providerRegisterForm");

const providerRegisterBtn =
    document.getElementById("providerRegisterBtn");

const providerRegisterMessage =
    document.getElementById("providerRegisterMessage");


// ========================================
// SHOW MESSAGE
// ========================================

function showProviderMessage(message, type = "error") {

    if (!providerRegisterMessage) {
        return;
    }

    providerRegisterMessage.textContent = message;

    providerRegisterMessage.className =
        "provider-auth-message show " + type;
}


// ========================================
// REGISTER PROVIDER
// ========================================

async function registerProvider() {

    const fullName =
        document
            .getElementById("providerFullName")
            .value
            .trim();

    const shopName =
        document
            .getElementById("providerShopName")
            .value
            .trim();

    const phone =
        document
            .getElementById("providerPhone")
            .value
            .trim();

    const email =
        document
            .getElementById("providerEmail")
            .value
            .trim();

    const category =
        document
            .getElementById("providerCategory")
            .value;

    const address =
        document
            .getElementById("providerAddress")
            .value
            .trim();

    const password =
        document
            .getElementById("providerPassword")
            .value;

    const confirmPassword =
        document
            .getElementById("providerConfirmPassword")
            .value;


    // ========================================
    // VALIDATION
    // ========================================

    if (!fullName ||
        !shopName ||
        !phone ||
        !email ||
        !category ||
        !address ||
        !password ||
        !confirmPassword) {

        showProviderMessage(
            "အချက်အလက်အားလုံးကို ဖြည့်ပေးပါ။",
            "error"
        );

        return;
    }


    if (password.length < 6) {

        showProviderMessage(
            "Password သည် အနည်းဆုံး 6 လုံးရှိရပါမယ်။",
            "error"
        );

        return;
    }


    if (password !== confirmPassword) {

        showProviderMessage(
            "Password နှစ်ခု မတူပါ။",
            "error"
        );

        return;
    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    providerRegisterBtn.disabled = true;

    providerRegisterBtn.textContent =
        "စာရင်းသွင်းနေသည်...";


    try {

        // ========================================
        // CREATE SUPABASE AUTH USER
        // ========================================

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        full_name: fullName,

                        phone: phone,

                        shop_name: shopName,

                        category: category,

                        address: address,

                        role: "provider",

                        status: "pending"

                    }

                }

            });


        if (error) {
            throw error;
        }


        if (!data.user) {

            throw new Error(
                "Account ဖန်တီး၍ မရပါ။"
            );

        }


        // ========================================
        // SAVE PROVIDER PROFILE
        // ========================================

        const {
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .upsert({

                    id: data.user.id,

                    full_name: fullName,

                    phone: phone,

                    role: "provider",

                    status: "pending",

                    shop_name: shopName,

                    category: category,

                    address: address

                });


        if (profileError) {
            throw profileError;
        }


        // ========================================
        // SUCCESS
        // ========================================

        showProviderMessage(
            "ဆိုင်စာရင်းသွင်းမှု အောင်မြင်ပါပြီ။ Admin စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။",
            "success"
        );


        providerRegisterForm.reset();


        // Redirect after success

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 2500);


    } catch (error) {

        console.error(
            "Provider registration error:",
            error
        );


        let message =
            error.message ||
            "စာရင်းသွင်းရာတွင် ပြဿနာရှိနေပါသည်။";


        // Common Supabase errors

        if (
            message.toLowerCase()
                .includes("already registered")
        ) {

            message =
                "ဒီ Email နဲ့ Account ရှိပြီးသားဖြစ်ပါတယ်။";

        }


        showProviderMessage(
            message,
            "error"
        );


    } finally {

        providerRegisterBtn.disabled = false;

        providerRegisterBtn.textContent =
            "🏪 ဆိုင်စာရင်းသွင်းမယ်";

    }

}


// ========================================
// FORM SUBMIT
// ========================================

if (providerRegisterForm) {

    providerRegisterForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            await registerProvider();

        }
    );

}

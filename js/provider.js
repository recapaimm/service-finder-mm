// ========================================
// PROVIDER REGISTER
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("providerRegisterForm");
    const button = document.getElementById("providerRegisterBtn");
    const message = document.getElementById("providerRegisterMessage");


    // ========================================
    // CHECK ELEMENTS
    // ========================================

    if (!form || !button || !message) {
        console.error("Provider register elements not found.");
        return;
    }


    // ========================================
    // SHOW MESSAGE
    // ========================================

    function showMessage(text, type = "error") {

        message.textContent = text;

        message.className =
            "provider-auth-message show " + type;
    }


    // ========================================
    // SUBMIT
    // ========================================

    form.addEventListener("submit", async function (e) {

        e.preventDefault();


        // ====================================
        // GET FORM VALUES
        // ====================================

        const fullName =
            document.getElementById("providerFullName")
                .value
                .trim();

        const shopName =
            document.getElementById("providerShopName")
                .value
                .trim();

        const phone =
            document.getElementById("providerPhone")
                .value
                .trim();

        const email =
            document.getElementById("providerEmail")
                .value
                .trim()
                .toLowerCase();

        const category =
            document.getElementById("providerCategory")
                .value;

        const address =
            document.getElementById("providerAddress")
                .value
                .trim();

        const password =
            document.getElementById("providerPassword")
                .value;

        const confirmPassword =
            document.getElementById("providerConfirmPassword")
                .value;


        // ====================================
        // VALIDATION
        // ====================================

        if (
            !fullName ||
            !shopName ||
            !phone ||
            !email ||
            !category ||
            !address ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "အချက်အလက်အားလုံးကို ဖြည့်ပေးပါ။",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password အနည်းဆုံး 6 လုံးရှိရပါမယ်။",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Password နှစ်ခု မတူပါ။",
                "error"
            );

            return;
        }


        // ====================================
        // CHECK SUPABASE
        // ====================================

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            showMessage(
                "❌ Supabase ချိတ်ဆက်မှု မရှိပါ။ auth.js ကို စစ်ပေးပါ။",
                "error"
            );

            return;
        }


        // ====================================
        // LOADING
        // ====================================

        button.disabled = true;

        button.textContent =
            "⏳ စာရင်းသွင်းနေပါသည်...";

        message.className =
            "provider-auth-message";


        try {

            // ====================================
            // 1. CREATE SUPABASE AUTH ACCOUNT
            // ====================================

            const {
                data: authData,
                error: authError
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

                        address: address

                    }

                }

            });


            // Auth error
            if (authError) {
                throw authError;
            }


            // User မရရင်
            if (!authData || !authData.user) {

                throw new Error(
                    "Supabase Auth Account ဖန်တီး၍ မရပါ။"
                );
            }


            console.log(
                "Auth user created:",
                authData.user.id
            );


            // ====================================
            // 2. CHECK SESSION
            // ====================================

            const {
                data: sessionData,
                error: sessionError
            } =
            await supabaseClient.auth.getSession();


            if (sessionError) {
                throw sessionError;
            }


            // ====================================
            // EMAIL CONFIRMATION ON ဖြစ်နေရင်
            // ====================================

            if (!sessionData.session) {

                showMessage(
                    "✅ Account ဖန်တီးပြီးပါပြီ။ Email Confirmation လိုအပ်နေပါတယ်။ Email ကိုစစ်ပြီး အတည်ပြုပြီးမှ Login ဝင်ပါ။",
                    "success"
                );

                button.textContent =
                    "✅ Account ဖန်တီးပြီးပါပြီ";

                return;
            }


            // ====================================
            // 3. REGISTER PROVIDER PROFILE
            // ====================================

            const {
                data: providerData,
                error: rpcError
            } =
            await supabaseClient.rpc(
                "register_provider",
                {

                    p_full_name: fullName,

                    p_phone: phone,

                    p_shop_name: shopName,

                    p_category: category,

                    p_address: address

                }
            );


            // RPC error
            if (rpcError) {

                console.error(
                    "register_provider RPC error:",
                    rpcError
                );

                throw rpcError;
            }


            console.log(
                "Provider profile created:",
                providerData
            );


            // ====================================
            // 4. SUCCESS
            // ====================================

            showMessage(
                "✅ ဆိုင်စာရင်းသွင်းခြင်း အောင်မြင်ပါပြီ။ Admin မှ စစ်ဆေးအတည်ပြုပေးပါမည်။",
                "success"
            );


            button.textContent =
                "✅ စာရင်းသွင်းပြီးပါပြီ";


            form.reset();


            // ====================================
            // 5. GO LOGIN
            // ====================================

            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 3000);


        } catch (error) {

            // ====================================
            // ERROR
            // ====================================

            console.error(
                "Provider Register Error:",
                error
            );


            let errorMessage =
                error?.message ||
                "စာရင်းသွင်းရာတွင် ပြဿနာဖြစ်နေပါသည်။";


            const lower =
                errorMessage.toLowerCase();


            // ====================================
            // FRIENDLY ERROR MESSAGES
            // ====================================

            if (
                lower.includes("already registered") ||
                lower.includes("user already registered")
            ) {

                errorMessage =
                    "❌ ဒီ Email နဲ့ Account ရှိပြီးသားဖြစ်ပါတယ်။ Login ဝင်ကြည့်ပါ။";
            }


            else if (
                lower.includes("invalid email")
            ) {

                errorMessage =
                    "❌ Email ပုံစံမှားနေပါတယ်။ ပြန်စစ်ပေးပါ။";
            }


            else if (
                lower.includes("password") &&
                lower.includes("6")
            ) {

                errorMessage =
                    "❌ Password အနည်းဆုံး 6 လုံးရှိရပါမယ်။";
            }


            else if (
                lower.includes("you must be logged in")
            ) {

                errorMessage =
                    "❌ Login Session မရရှိပါ။ Email confirmation setting ကို စစ်ပေးပါ။";
            }


            else if (
                lower.includes("profiles_pkey") ||
                lower.includes("duplicate key")
            ) {

                errorMessage =
                    "❌ Profile အချက်အလက် ထပ်နေပါတယ်။ Database function ကို စစ်ဆေးရန်လိုပါတယ်။";
            }


            else if (
                lower.includes("register_provider")
            ) {

                errorMessage =
                    "❌ ဆိုင်အချက်အလက် သိမ်းဆည်းရာတွင် ပြဿနာရှိနေပါတယ်။";
            }


            // ====================================
            // SHOW ERROR
            // ====================================

            showMessage(
                errorMessage,
                "error"
            );


            button.disabled = false;

            button.textContent =
                "🏪 ဆိုင်စာရင်းသွင်းမယ်";

        }

    });

});

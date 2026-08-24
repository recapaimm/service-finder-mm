// ========================================
// PROVIDER LOGIN
// ========================================

document.addEventListener("DOMContentLoaded", async function () {

    const loginForm =
        document.getElementById("providerLoginForm");

    const loginBtn =
        document.getElementById("providerLoginBtn");

    const messageBox =
        document.getElementById("providerLoginMessage");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ========================================
    // SHOW MESSAGE
    // ========================================

    function showMessage(message, type = "error") {

        if (!messageBox) return;

        messageBox.textContent = message;

        messageBox.className =
            "provider-auth-message show " + type;
    }


    // ========================================
    // CHECK CURRENT LOGIN
    // ========================================

    async function checkCurrentLogin() {

        try {

            const user =
                await getCurrentUser();

            if (user) {

                // Login ဝင်ထားပြီး
                if (logoutBtn) {
                    logoutBtn.style.display = "block";
                }

                if (loginBtn) {
                    loginBtn.style.display = "none";
                }

                if (messageBox) {
                    showMessage(
                        "✅ အကောင့်ဝင်ထားပြီးပါပြီ။",
                        "success"
                    );
                }

            } else {

                // Login မဝင်ထားသေး
                if (logoutBtn) {
                    logoutBtn.style.display = "none";
                }

                if (loginBtn) {
                    loginBtn.style.display = "block";
                }

            }

        } catch (error) {

            console.error(
                "Login check error:",
                error
            );

        }

    }


    // ========================================
    // LOGIN
    // ========================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById("providerEmail")
                        .value
                        .trim();

                const password =
                    document
                        .getElementById("providerPassword")
                        .value;


                // ==================================
                // VALIDATION
                // ==================================

                if (!email || !password) {

                    showMessage(
                        "Email နဲ့ Password နှစ်ခုလုံး ဖြည့်ပေးပါ။",
                        "error"
                    );

                    return;
                }


                // ==================================
                // LOGIN START
                // ==================================

                loginBtn.disabled = true;

                loginBtn.innerHTML =
                    "<span>⏳ ဝင်ရောက်နေပါသည်...</span>";


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth.signInWithPassword({

                            email: email,

                            password: password

                        });


                    if (error) {
                        throw error;
                    }


                    if (!data || !data.user) {

                        throw new Error(
                            "Login မအောင်မြင်ပါ။"
                        );

                    }


                    // ==================================
                    // LOGIN SUCCESS
                    // ==================================

                    showMessage(
                        "✅ Login အောင်မြင်ပါပြီ။",
                        "success"
                    );


                    loginBtn.innerHTML =
                        "<span>✅ ဝင်ရောက်ပြီးပါပြီ</span>";


                    loginBtn.style.display =
                        "none";


                    // Logout ပေါ်လာမယ်
                    if (logoutBtn) {

                        logoutBtn.style.display =
                            "block";

                    }


                } catch (error) {

                    console.error(
                        "Provider login error:",
                        error
                    );


                    let message =
                        error?.message ||
                        "Login ဝင်ရာတွင် ပြဿနာဖြစ်နေပါသည်။";


                    const lower =
                        message.toLowerCase();


                    if (
                        lower.includes(
                            "invalid login credentials"
                        )
                    ) {

                        message =
                            "❌ Email သို့မဟုတ် Password မှားနေပါတယ်။";

                    }

                    else if (
                        lower.includes(
                            "email not confirmed"
                        )
                    ) {

                        message =
                            "📧 Email အတည်ပြုရန် လိုအပ်နေပါတယ်။";

                    }

                    else if (
                        lower.includes(
                            "too many requests"
                        )
                    ) {

                        message =
                            "⏳ Login ကြိုးစားမှုများလွန်းပါသည်။ ခဏစောင့်ပြီး ပြန်ကြိုးစားပါ။";

                    }


                    showMessage(
                        message,
                        "error"
                    );


                    loginBtn.disabled =
                        false;

                    loginBtn.innerHTML =
                        "<span>ဝင်မယ်</span>";

                }

            }
        );

    }


    // ========================================
    // LOGOUT
    // ========================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async function () {

                logoutBtn.disabled =
                    true;

                logoutBtn.textContent =
                    "⏳ အကောင့်ထွက်နေပါသည်...";


                try {

                    await supabaseClient.auth.signOut();


                    // Logout ပြီးရင်
                    // Logout button ပျောက်
                    logoutBtn.style.display =
                        "none";


                    // Login button ပြန်ပေါ်
                    if (loginBtn) {

                        loginBtn.style.display =
                            "block";

                        loginBtn.disabled =
                            false;

                        loginBtn.innerHTML =
                            "<span>ဝင်မယ်</span>";

                    }


                    // Form ပြန်ရှင်း
                    if (loginForm) {
                        loginForm.reset();
                    }


                    showMessage(
                        "✅ အကောင့်ထွက်ပြီးပါပြီ။",
                        "success"
                    );


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    logoutBtn.disabled =
                        false;

                    logoutBtn.textContent =
                        "🚪 အကောင့်ထွက်မယ်";


                    showMessage(
                        "❌ အကောင့်ထွက်ရာတွင် ပြဿနာရှိနေပါသည်။",
                        "error"
                    );

                }

            }
        );

    }


    // ========================================
    // INITIAL CHECK
    // ========================================

    await checkCurrentLogin();

});

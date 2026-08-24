// ========================================
// PROVIDER LOGIN
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("providerLoginForm");

    const loginBtn =
        document.getElementById("providerLoginBtn");

    const messageBox =
        document.getElementById("providerLoginMessage");


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
    // LOGIN
    // ========================================

    if (!loginForm) return;


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
            // LOADING
            // ==================================

            loginBtn.disabled = true;

            loginBtn.innerHTML =
                "<span>⏳ ဝင်ရောက်နေပါသည်...</span>";


            try {

                // ==================================
                // SUPABASE LOGIN
                // ==================================

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


                const user = data.user;


                // ==================================
                // GET PROVIDER PROFILE
                // ==================================

                const {
                    data: profile,
                    error: profileError
                } =
                    await supabaseClient
                        .from("profiles")
                        .select(
                            "id, full_name, phone, role, status, shop_name, category, address"
                        )
                        .eq("id", user.id)
                        .single();


                if (profileError || !profile) {

                    console.error(
                        "Profile error:",
                        profileError
                    );

                    await supabaseClient.auth.signOut();

                    throw new Error(
                        "ဆိုင်အကောင့်အချက်အလက် မတွေ့ပါ။"
                    );

                }


                // ==================================
                // CHECK ROLE
                // ==================================

                if (profile.role !== "provider") {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "❌ ဒီအကောင့်သည် ဆိုင်ပိုင်ရှင်အကောင့် မဟုတ်ပါ။",
                        "error"
                    );

                    loginBtn.disabled = false;

                    loginBtn.innerHTML =
                        "<span>ဝင်မယ်</span>";

                    return;

                }


                // ==================================
                // CHECK STATUS
                // ==================================

                const status =
                    String(profile.status || "")
                        .toLowerCase();


                // ==================================
                // PENDING
                // ==================================

                if (status === "pending") {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "⏳ ဆိုင်စာရင်းသွင်းမှုကို Admin မှ စစ်ဆေးနေပါသည်။ Admin အတည်ပြုပြီးမှ Login ဝင်နိုင်ပါမည်။",
                        "error"
                    );

                    loginBtn.disabled = false;

                    loginBtn.innerHTML =
                        "<span>ဝင်မယ်</span>";

                    return;

                }


                // ==================================
                // REJECTED
                // ==================================

                if (
                    status === "rejected" ||
                    status === "declined"
                ) {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "❌ သင့်ဆိုင်စာရင်းကို Admin မှ အတည်မပြုသေးပါ။ Admin နှင့် ဆက်သွယ်ပါ။",
                        "error"
                    );

                    loginBtn.disabled = false;

                    loginBtn.innerHTML =
                        "<span>ဝင်မယ်</span>";

                    return;

                }


                // ==================================
                // NOT APPROVED
                // ==================================

                if (status !== "approved") {

                    await supabaseClient.auth.signOut();

                    showMessage(
                        "⏳ သင့်အကောင့်အခြေအနေကို Admin မှ စစ်ဆေးနေပါသည်။",
                        "error"
                    );

                    loginBtn.disabled = false;

                    loginBtn.innerHTML =
                        "<span>ဝင်မယ်</span>";

                    return;

                }


                // ==================================
                // APPROVED
                // ==================================

                showMessage(
                    "✅ Login အောင်မြင်ပါပြီ။ Dashboard သို့ ဝင်နေပါသည်...",
                    "success"
                );


                loginBtn.innerHTML =
                    "<span>✅ ဝင်ရောက်ပြီးပါပြီ</span>";


                // ==================================
                // GO TO DASHBOARD
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "provider-dashboard.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Provider login error:",
                    error
                );


                let errorMessage =
                    error?.message ||
                    "Login ဝင်ရာတွင် ပြဿနာဖြစ်နေပါသည်။";


                const lower =
                    errorMessage.toLowerCase();


                if (
                    lower.includes(
                        "invalid login credentials"
                    )
                ) {

                    errorMessage =
                        "❌ Email သို့မဟုတ် Password မှားနေပါတယ်။";

                }

                else if (
                    lower.includes(
                        "email not confirmed"
                    )
                ) {

                    errorMessage =
                        "📧 Email အတည်ပြုရန် လိုအပ်နေပါတယ်။";

                }


                showMessage(
                    errorMessage,
                    "error"
                );


                loginBtn.disabled = false;

                loginBtn.innerHTML =
                    "<span>ဝင်မယ်</span>";

            }

        }
    );

});

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

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById("providerEmail")
                        .value
                        .trim()
                        .toLowerCase();


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


                messageBox.className =
                    "provider-auth-message";


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
                            .select(`
                                id,
                                full_name,
                                phone,
                                shop_name,
                                category,
                                address,
                                role,
                                status
                            `)
                            .eq("id", user.id)
                            .maybeSingle();


                    if (profileError) {

                        console.error(
                            "Profile error:",
                            profileError
                        );

                        // Login session ကို ပြန်ပိတ်
                        await supabaseClient.auth.signOut();

                        throw new Error(
                            "အကောင့်အချက်အလက်ကို ရှာမတွေ့ပါ။"
                        );
                    }


                    if (!profile) {

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

                        throw new Error(
                            "ဒီအကောင့်သည် ဆိုင်ပိုင်ရှင်အကောင့် မဟုတ်ပါ။"
                        );
                    }


                    // ==================================
                    // CHECK ADMIN APPROVAL
                    // ==================================

                    const status =
                        String(
                            profile.status || ""
                        ).toLowerCase();


                    // PENDING
                    if (status === "pending") {

                        await supabaseClient.auth.signOut();

                        showMessage(
                            "⏳ သင့်ဆိုင်အကောင့်ကို Admin မှ စစ်ဆေးနေဆဲဖြစ်ပါတယ်။ အတည်ပြုပြီးမှ Login ဝင်နိုင်ပါမယ်။",
                            "error"
                        );

                        loginBtn.disabled = false;

                        loginBtn.innerHTML =
                            "<span>ဝင်မယ်</span>";

                        return;
                    }


                    // REJECTED
                    if (
                        status === "rejected" ||
                        status === "declined"
                    ) {

                        await supabaseClient.auth.signOut();

                        showMessage(
                            "❌ သင့်ဆိုင်စာရင်းကို Admin မှ အတည်မပြုသေးပါ။ Admin ထံ ဆက်သွယ်စစ်ဆေးပေးပါ။",
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

                    if (status !== "approved") {

                        await supabaseClient.auth.signOut();

                        showMessage(
                            "⏳ သင့်အကောင့်အခြေအနေကို Admin မှ စစ်ဆေးနေဆဲဖြစ်ပါတယ်။",
                            "error"
                        );

                        loginBtn.disabled = false;

                        loginBtn.innerHTML =
                            "<span>ဝင်မယ်</span>";

                        return;
                    }


                    // ==================================
                    // LOGIN SUCCESS
                    // ==================================

                    showMessage(
                        "✅ Login အောင်မြင်ပါပြီ။ ခဏစောင့်ပါ...",
                        "success"
                    );


                    loginBtn.innerHTML =
                        "<span>✅ ဝင်ရောက်ပြီးပါပြီ</span>";


                    // ==================================
                    // GO TO PROVIDER DASHBOARD
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
                        "Provider Login Error:",
                        error
                    );


                    let message =
                        error?.message ||
                        "Login ဝင်ရာတွင် ပြဿနာဖြစ်နေပါသည်။";


                    const lower =
                        message.toLowerCase();


                    // ==================================
                    // FRIENDLY ERRORS
                    // ==================================

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
                            "⏳ Login ကြိုးစားမှုများလွန်းပါတယ်။ ခဏစောင့်ပြီး ပြန်ကြိုးစားပါ။";

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

});

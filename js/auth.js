// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL =
    "https://glowrcnmmcfeefiscbia.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_9n1c4srbln_mN1ddVq3HEw_0G-kA3in";


// ========================================
// CREATE SUPABASE CLIENT
// ========================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ========================================
// PROVIDER LOGIN
// ========================================

async function loginUser(email, password) {

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({

        email: email.trim(),

        password: password

    });


    if (error) {
        throw error;
    }


    if (!data.user) {

        throw new Error(
            "အကောင့်ဝင်၍ မရပါ။"
        );

    }


    // ========================================
    // GET PROVIDER PROFILE
    // ========================================

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();


    if (profileError) {

        console.error(
            "Profile error:",
            profileError
        );

        throw new Error(
            "ဆိုင်အချက်အလက်ကို ရယူ၍ မရပါ။"
        );

    }


    if (!profile) {

        throw new Error(
            "ဒီ Account အတွက် ဆိုင်အချက်အလက် မတွေ့ပါ။"
        );

    }


    // ========================================
    // PROVIDER CHECK
    // ========================================

    if (profile.role !== "provider") {

        await supabaseClient.auth.signOut();

        throw new Error(
            "ဒီ Account သည် ဆိုင်သမား Account မဟုတ်ပါ။"
        );

    }


    // ========================================
    // APPROVAL CHECK
    // ========================================

    if (profile.status === "pending") {

        throw new Error(
            "သင့်ဆိုင်စာရင်းကို Admin မှ စစ်ဆေးနေဆဲဖြစ်ပါတယ်။ အတည်ပြုပြီးမှ ဝင်ရောက်နိုင်ပါမယ်။"
        );

    }


    if (profile.status === "rejected") {

        throw new Error(
            "သင့်ဆိုင်စာရင်းကို Admin မှ အတည်မပြုသေးပါ။"
        );

    }


    if (profile.status !== "approved") {

        throw new Error(
            "သင့်ဆိုင် Account အခြေအနေကို စစ်ဆေး၍ မရပါ။"
        );

    }


    return {

        user: data.user,

        profile: profile

    };

}


// ========================================
// LOGOUT
// ========================================

async function logoutUser() {

    const {
        error
    } = await supabaseClient.auth.signOut();


    if (error) {
        throw error;
    }


    window.location.href =
        "login.html";

}


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser() {

    const {
        data: {
            user
        },
        error
    } = await supabaseClient.auth.getUser();


    if (error) {

        console.error(
            "Get user error:",
            error
        );

        return null;

    }


    return user;

}


// ========================================
// GET CURRENT PROVIDER PROFILE
// ========================================

async function getCurrentProvider() {

    const user =
        await getCurrentUser();


    if (!user) {
        return null;
    }


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "Provider profile error:",
            error
        );

        return null;

    }


    return profile;

}


// ========================================
// CHECK LOGIN
// ========================================

async function checkLogin() {

    const user =
        await getCurrentUser();

    return user;

}


// ========================================
// AUTH STATE CHANGE
// ========================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );

        console.log(
            "Session:",
            session
        );

    }
);


// ========================================
// PROVIDER LOGIN FORM
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "providerLoginForm"
            );


        const loginBtn =
            document.getElementById(
                "providerLoginBtn"
            );


        const messageBox =
            document.getElementById(
                "providerLoginMessage"
            );


        if (!loginForm) {
            return;
        }


        function showLoginMessage(
            message,
            type = "error"
        ) {

            if (!messageBox) {
                return;
            }


            messageBox.textContent =
                message;


            messageBox.className =
                "provider-auth-message show " +
                type;

        }


        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    document
                        .getElementById(
                            "providerEmail"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "providerPassword"
                        )
                        .value;


                if (!email || !password) {

                    showLoginMessage(
                        "Email နဲ့ Password ဖြည့်ပေးပါ။",
                        "error"
                    );

                    return;

                }


                loginBtn.disabled =
                    true;


                loginBtn.querySelector(
                    "span"
                ).textContent =
                    "ဝင်နေပါပြီ...";


                try {

                    await loginUser(
                        email,
                        password
                    );


                    showLoginMessage(
                        "အကောင့်ဝင်ခြင်း အောင်မြင်ပါပြီ။",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "provider-dashboard.html";

                        },
                        1000
                    );


                } catch (error) {

                    console.error(
                        "Provider login error:",
                        error
                    );


                    let message =
                        error.message ||
                        "အကောင့်ဝင်ရာတွင် ပြဿနာရှိနေပါသည်။";


                    if (
                        message
                            .toLowerCase()
                            .includes(
                                "email not confirmed"
                            )
                    ) {

                        message =
                            "Email ကို အရင်အတည်ပြုပေးပါ။ Email ထဲက Confirmation Link ကိုနှိပ်ပြီးမှ ပြန်ဝင်ပါ။";

                    }


                    showLoginMessage(
                        message,
                        "error"
                    );


                } finally {

                    loginBtn.disabled =
                        false;


                    loginBtn.querySelector(
                        "span"
                    ).textContent =
                        "ဝင်မယ်";

                }

            }
        );

    }
);

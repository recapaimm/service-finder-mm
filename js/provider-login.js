// ========================================
// PROVIDER LOGIN
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("providerLoginForm");
    const button = document.getElementById("providerLoginBtn");
    const message = document.getElementById("providerLoginMessage");

    if (!form) return;


    // ========================================
    // SHOW MESSAGE
    // ========================================

    function showMessage(text, type = "error") {

        message.textContent = text;

        message.className =
            "provider-auth-message show " + type;
    }


    // ========================================
    // LOGIN
    // ========================================

    form.addEventListener("submit", async function (event) {

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


        // Validation

        if (!email || !password) {

            showMessage(
                "Email နဲ့ Password ဖြည့်ပေးပါ။",
                "error"
            );

            return;
        }


        button.disabled = true;

        button.innerHTML = "ဝင်နေသည်...";


        try {

            // ========================================
            // SUPABASE LOGIN
            // ========================================

            const data =
                await loginUser(email, password);


            const user = data.user;


            if (!user) {

                throw new Error(
                    "Account ဝင်ရောက်၍ မရပါ။"
                );

            }


            // ========================================
            // GET PROFILE
            // ========================================

            const {
                data: profile,
                error: profileError
            } =
                await supabaseClient
                    .from("profiles")
                    .select(
                        "id, full_name, role, status, shop_name"
                    )
                    .eq("id", user.id)
                    .maybeSingle();


            if (profileError) {

                console.error(
                    "Profile error:",
                    profileError
                );

            }


            // ========================================
            // CHECK PROVIDER
            // ========================================

            if (
                profile &&
                profile.role !== "provider"
            ) {

                await supabaseClient.auth.signOut();

                throw new Error(
                    "ဒီ Account သည် ဆိုင်သမား Account မဟုတ်ပါ။"
                );

            }


            // ========================================
            // PENDING
            // ========================================

            if (
                profile &&
                profile.status === "pending"
            ) {

                showMessage(
                    "Login အောင်မြင်ပါပြီ။ သင့်ဆိုင်ကို Admin စစ်ဆေးနေဆဲဖြစ်ပါတယ်။",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 2000);


                return;
            }


            // ========================================
            // APPROVED
            // ========================================

            if (
                profile &&
                profile.status === "approved"
            ) {

                showMessage(
                    "ဝင်ရောက်မှု အောင်မြင်ပါပြီ။",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 1000);


                return;
            }


            // ========================================
            // NO PROFILE
            // ========================================

            showMessage(
                "Account ရှိပေမယ့် ဆိုင်အချက်အလက် မတွေ့ပါ။ Admin ကို စစ်ဆေးပေးရန်လိုပါတယ်။",
                "error"
            );


        } catch (error) {

            console.error(
                "Provider login error:",
                error
            );


            let msg =
                error.message ||
                "Login ပြုလုပ်ရာတွင် ပြဿနာရှိနေပါသည်။";


            if (
                msg
                    .toLowerCase()
                    .includes("invalid login credentials")
            ) {

                msg =
                    "Email သို့မဟုတ် Password မမှန်ပါ။ Account မဖွင့်ရသေးပါက အရင် ဆိုင်စာရင်းသွင်းပါ။";

            }


            showMessage(
                msg,
                "error"
            );

        } finally {

            button.disabled = false;

            button.innerHTML =
                "<span>ဝင်မယ်</span>";

        }

    });

});

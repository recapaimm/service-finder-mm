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

        showProviderMessage(
            "အချက်အလက်အားလုံးကို ဖြည့်ပေးပါ။",
            "error"
        );

        return;
    }


    if (password.length < 6) {

        showProviderMessage(
            "Password သည် အနည်းဆုံး 6 လုံးရှိရပါ

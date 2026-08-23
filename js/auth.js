// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL =
    "https://glowrcnmmcfeefiscbia.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_9n1c4srbln_mN1ddVq3HEw_0G-kA3in";


// Create Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// SIGN UP
// ========================================

async function signUpUser(email, password, fullName, phone = "") {

    const { data, error } =
        await supabaseClient.auth.signUp({
            email: email,
            password: password,

            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                }
            }
        });

    if (error) {
        throw error;
    }

    // Email confirmation is OFF,
    // so normally a session will be returned.

    if (data.user) {

        const { error: profileError } =
            await supabaseClient
                .from("profiles")
                .upsert({
                    id: data.user.id,
                    full_name: fullName,
                    phone: phone
                });

        if (profileError) {
            console.error(
                "Profile creation error:",
                profileError
            );
        }
    }

    return data;
}


// ========================================
// LOGIN
// ========================================

async function loginUser(email, password) {

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        throw error;
    }

    return data;
}


// ========================================
// LOGOUT
// ========================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        throw error;
    }

    window.location.href = "login.html";
}


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser() {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("Get user error:", error);
        return null;
    }

    return user;
}


// ========================================
// CHECK LOGIN
// ========================================

async function checkLogin() {

    const user = await getCurrentUser();

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

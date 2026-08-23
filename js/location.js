/* ========================================
   LOCATION
======================================== */


/**
 * Request user location
 */
function requestLocation() {

    const status =
        document.getElementById("locationStatus");


    if (!navigator.geolocation) {

        showLocationStatus(
            "ဒီဖုန်းမှာ တည်နေရာရှာဖွေမှု မရရှိနိုင်ပါ။",
            true
        );

        return;
    }


    showLocationStatus(
        "📍 တည်နေရာရှာနေပါသည်..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );


            showLocationStatus(
                "✅ တည်နေရာရရှိပါပြီ။"
            );
        },


        error => {

            console.error(error);


            showLocationStatus(
                "⚠️ တည်နေရာအသုံးပြုခွင့် မရပါ။ ဖုန်း Setting မှ ခွင့်ပြုပေးပါ။",
                true
            );
        },


        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0
        }
    );
}


/**
 * Location status message
 */
function showLocationStatus(
    message,
    isError = false
) {

    const status =
        document.getElementById(
            "locationStatus"
        );


    if (!status) return;


    status.textContent =
        message;


    status.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";
}

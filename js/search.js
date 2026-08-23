/* ========================================
   SEARCH
======================================== */


/**
 * Search services
 */
function searchServices(keyword) {

    const value =
        keyword
            .trim()
            .toLowerCase();


    if (!value) {

        renderServices(allServices);

        updateServiceTitle(
            "လူကြိုက်များသော ဝန်ဆောင်မှုများ"
        );

        return;
    }


    const results =
        allServices.filter(service => {

            const text = [

                service.name,

                service.category,

                service.address,

                service.description

            ]
                .join(" ")
                .toLowerCase();


            return text.includes(value);
        });


    renderServices(results);


    updateServiceTitle(
        `"${keyword}" အတွက် ရှာဖွေမှုရလဒ်`
    );
}


/**
 * Filter by category
 */
function filterByCategory(category) {

    if (!category) {

        renderServices(allServices);

        return;
    }


    const results =
        allServices.filter(
            service =>
                service.category === category
        );


    renderServices(results);


    updateServiceTitle(
        `${category} ဝန်ဆောင်မှုများ`
    );
}


/**
 * Update title
 */
function updateServiceTitle(title) {

    const element =
        document.getElementById("serviceTitle");

    if (element) {
        element.textContent = title;
    }
      }

/* ========================================
   MAIN APP
======================================== */


/**
 * Start application
 */
document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeApp();

    }
);


/**
 * Initialize
 */
function initializeApp() {

    loadServices();


    setupSearch();


    setupCategories();


    setupLocation();


    setupModal();


    setupViewAll();


    setupResetSearch();

}


/**
 * Search events
 */
function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const button =
        document.getElementById(
            "searchBtn"
        );


    if (!input || !button) return;


    button.addEventListener(
        "click",
        () => {

            searchServices(
                input.value
            );

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                searchServices(
                    input.value
                );

            }

        }
    );


    input.addEventListener(
        "input",
        () => {

            if (
                input.value.trim() === ""
            ) {

                searchServices("");

            }

        }
    );
}


/**
 * Category events
 */
function setupCategories() {

    const cards =
        document.querySelectorAll(
            ".category-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                card.classList.add(
                    "active"
                );


                const category =
                    card.dataset.category;


                filterByCategory(
                    category
                );


                scrollToServices();

            }
        );

    });
}


/**
 * Location events
 */
function setupLocation() {

    const button =
        document.getElementById(
            "locationBtn"
        );


    const headerButton =
        document.getElementById(
            "headerLocationBtn"
        );


    if (button) {

        button.addEventListener(
            "click",
            requestLocation
        );

    }


    if (headerButton) {

        headerButton.addEventListener(
            "click",
            requestLocation
        );

    }
}


/**
 * Modal events
 */
function setupModal() {

    const closeButton =
        document.getElementById(
            "modalClose"
        );


    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeServiceModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeServiceModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeServiceModal();

            }

        }
    );
}


/**
 * View all
 */
function setupViewAll() {

    const button =
        document.getElementById(
            "viewAllBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".category-card"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            const input =
                document.getElementById(
                    "searchInput"
                );


            if (input) {
                input.value = "";
            }


            searchServices("");


            scrollToServices();

        }
    );
}


/**
 * Reset search
 */
function setupResetSearch() {

    const button =
        document.getElementById(
            "resetSearchBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "searchInput"
                );


            if (input) {
                input.value = "";
            }


            document
                .querySelectorAll(
                    ".category-card"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            searchServices("");


            scrollToServices();

        }
    );
}


/**
 * Scroll to service section
 */
function scrollToServices() {

    const section =
        document.querySelector(
            ".services-section"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}

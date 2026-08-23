/* ========================================
   SERVICE DATA
======================================== */

let allServices = [];


/**
 * Load services from JSON
 */
async function loadServices() {

    try {

        const response =
            await fetch("data/services.json");

        if (!response.ok) {
            throw new Error("Service data loading failed");
        }

        const data = await response.json();

        allServices = data.services || [];

        renderServices(allServices);

    } catch (error) {

        console.error(error);

        const grid =
            document.getElementById("serviceGrid");

        if (grid) {

            grid.innerHTML = `
                <div class="loading">
                    ဝန်ဆောင်မှုဒေတာကို
                    ဖတ်၍မရပါ။
                </div>
            `;
        }
    }
}


/**
 * Render service cards
 */
function renderServices(services) {

    const grid =
        document.getElementById("serviceGrid");

    const count =
        document.getElementById("resultCount");

    const empty =
        document.getElementById("emptyState");

    if (!grid) return;


    if (count) {
        count.textContent =
            `${services.length} ခု`;
    }


    if (services.length === 0) {

        grid.innerHTML = "";

        if (empty) {
            empty.classList.remove("hidden");
        }

        return;
    }


    if (empty) {
        empty.classList.add("hidden");
    }


    grid.innerHTML =
        services.map(service => `

            <article
                class="service-card"
                data-id="${service.id}"
            >

                <div class="service-image">
                    ${service.icon}
                </div>


                <div class="service-body">

                    <span class="service-category">
                        ${service.category}
                    </span>

                    <h3 class="service-name">
                        ${service.name}
                    </h3>

                    <p class="service-address">
                        📍 ${service.address}
                    </p>


                    <div class="service-meta">

                        <span class="rating">
                            ⭐ ${service.rating}
                            (${service.reviews})
                        </span>

                        <span class="distance">
                            ${service.distance} km
                        </span>

                    </div>


                    <div class="service-actions">

                        <button
                            class="detail-btn"
                            onclick="showServiceDetail(${service.id})"
                        >
                            အသေးစိတ်
                        </button>

                        <button
                            class="call-btn"
                            onclick="callService('${service.phone}')"
                        >
                            📞 ဖုန်းဆက်
                        </button>

                    </div>

                </div>

            </article>

        `).join("");
}


/**
 * Show service detail
 */
function showServiceDetail(id) {

    const service =
        allServices.find(
            item => item.id === id
        );

    if (!service) return;


    const modal =
        document.getElementById("serviceModal");

    const body =
        document.getElementById("modalBody");

    if (!modal || !body) return;


    const mapQuery =
        encodeURIComponent(
            `${service.name}, ${service.address}`
        );


    body.innerHTML = `

        <div class="detail-icon">
            ${service.icon}
        </div>

        <span class="service-category">
            ${service.category}
        </span>

        <h2 class="detail-title">
            ${service.name}
        </h2>

        <div class="service-meta">

            <span class="rating">
                ⭐ ${service.rating}
                (${service.reviews} reviews)
            </span>

            <span class="distance">
                ${service.distance} km
            </span>

        </div>


        <div class="detail-info">

            <p>
                📍 ${service.address}
            </p>

            <p>
                📞 ${service.phone}
            </p>

            <p>
                ${service.description}
            </p>

        </div>


        <div class="detail-buttons">

            <a
                class="phone-link"
                href="tel:${service.phone}"
            >
                📞 ဖုန်းဆက်မယ်
            </a>

            <a
                class="map-link"
                href="https://www.google.com/maps/search/?api=1&query=${mapQuery}"
                target="_blank"
                rel="noopener"
            >
                🗺️ မြေပုံကြည့်မယ်
            </a>

        </div>

    `;


    modal.classList.remove("hidden");
}


/**
 * Call service
 */
function callService(phone) {

    window.location.href =
        `tel:${phone}`;
}


/**
 * Close service modal
 */
function closeServiceModal() {

    const modal =
        document.getElementById("serviceModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

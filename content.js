(function() {
    const matchDiv = document.querySelector('div.match');
    if (!matchDiv) {
        console.error("No div.match found on this page.");
        return;
    }

    const rawJson = matchDiv.getAttribute('data-pusher-realtime');
    if (!rawJson) {
        console.error("No data-pusher-realtime attribute found on div.match.")
        return;
    }

    let jsonData;
    try {
        jsonData = JSON.parse(rawJson);
        console.log("Extracted JSON: ", jsonData)
    } catch (error) {
        console.error("Failed to parse: ", error);
    }

    if (jsonData.data.match.status == 'Upcoming')
    {
        // console.log("Match is upcoming. No cards...")
        return;
    }

    let events;
    events = jsonData.data.events;
    if (!Array.isArray(events)) {
        console.warn("No events array found in jsonContent.data.events");
        return;
    }

    events = jsonData?.data?.events?.filter(e => e.event === "card");

    const cardsTable = document.querySelector('#cards table');
    if (!cardsTable) {
        console.error("Card details table not found...")
        return;
    }

    const rows = cardsTable.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        console.warn("No rows found in card table.");
        return;
    }

    const headerRow = cardsTable.querySelector('tr');
    if (headerRow) {
        const th = document.createElement('th');
        th.textContent = "Reason";
        headerRow.appendChild(th);
    }

    events.forEach((event, index) => {
        if (index >= rows.length) return;
        console.log(JSON.parse(event.data))
        let narrative = "";
        try {
            const parsed = JSON.parse(event.data);
            narrative = parsed?.narrative || "";
        } catch (e) {
            console.error("Failed to parse event.data JSON", e);
        }

        const td = document.createElement('td');
        td.textContent = narrative;
        rows[index+1].appendChild(td);
    });
    
    // Find nav for options
    const dataDiv = document.querySelector(".nav.nav-tabs");

    // Create new list element for nav
    const newNavLi = document.createElement("li");
    dataDiv.appendChild(newNavLi);

    // Add link element to list element
    const newNavLink = document.createElement("a");
    newNavLink.setAttribute("data-toggle", "tab");
    newNavLink.setAttribute("href", "#referrals");
    newNavLink.textContent = "Referrals";
    newNavLi.appendChild(newNavLink);

    referrals = jsonData?.data?.events?.filter(e => e.event === "referral");
    console.log(referrals);
})();
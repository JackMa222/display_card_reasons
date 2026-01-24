(function() {
    // Get key match information

    // Umpires (U1, U2, RU)
    const officialsTable = document.querySelector('#officials table');
    const officialsTableRows = officialsTable?.querySelectorAll("tbody tr") ?? [];

    const officials = {
        umpires: [],
        reserve: null,
        video: null
    };

    officialsTableRows.forEach(row => {
        const role = row.cells[0]?.textContent.trim();
        const linkElement = row.cells[1]?.querySelector("a");

        if (!role || !linkElement) return;

        const data = {
            name: linkElement.textContent.trim().replace(/\s+/g, ' '),
            url: linkElement.href
        };

        if (role === "Umpire") {
            officials.umpires.push(data);
        } else if (role === "Reserve Umpire") {
            officials.reserve = data;
        } else if (role === "Video Umpire") {
            officials.video = data;
        }
    })

    // Final Umpire variables
    const U1 = officials.umpires[0] || null;
    const U2 = officials.umpires[1] || null;
    const RU = officials.reserve;
    const VU = officials.video || {name: "No Video Umpire Appointed", url: "#referrals"};

    // Team Names
    const matchHeader = document.querySelector(".match_header");
    const teamNameRows = matchHeader?.querySelector(".row")?.querySelectorAll(".col-md-4") ?? [];
    const teamNames = Array.from(teamNameRows).map(col => col.querySelector("h2")?.textContent.trim()).filter(name => name);
    if (teamNames.length >= 2) {
        homeTeamName = teamNames[0];
        awayTeamName = teamNames[1];
    } else {
        homeTeamName = "Home";
        awayTeamName = "Away";
    }

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

    //console.log(jsonData);

    if (jsonData.data.match.status == 'Upcoming')
    {
        // console.log("Match is upcoming. No events...")
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
    
    if (events.length == 0) {
        const td = rows[1].querySelector("td")
        td.setAttribute("colspan", "7");
    }

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

    // Get tab content div
    const tabContent = document.querySelector(".tab-content");
    const referralTabContent = document.createElement("div");
    referralTabContent.setAttribute("class", "tab-pane fade");
    referralTabContent.setAttribute("id", "referrals");
    tabContent.appendChild(referralTabContent);

    // Add panel styling elements
    const primaryPanel = document.createElement("div");
    primaryPanel.setAttribute("class", "panel panel-primary");
    referralTabContent.appendChild(primaryPanel);

    // Add panel heading
    const panelHeading = document.createElement("div");
    panelHeading.setAttribute("class", "panel-heading");
    primaryPanel.appendChild(panelHeading);

    const panelTitle = document.createElement("h3");
    panelTitle.setAttribute("class", "panel-title");
    panelTitle.textContent = "Video Referrals";
    panelHeading.appendChild(panelTitle);

    // Add panel body
    const panelBody = document.createElement("div");
    panelBody.setAttribute("class", "panel-body");
    primaryPanel.appendChild(panelBody);

    // Add table class and table element to panel body
    const tableClass = document.createElement("div");
    tableClass.setAttribute("class", "table-responsive");
    panelBody.appendChild(tableClass);

    const tableElement = document.createElement("table");
    tableElement.setAttribute("class", "table table-condensed table-hover");
    tableClass.appendChild(tableElement);

    // Add Video Umpire caption
    const VUCaption = document.createElement("caption");
    VUCaption.setAttribute("style", "caption-side:bottom; text-align: right;");
    VUCaption.appendChild(document.createTextNode("Video Umpire: "));
    const VUCaptionLink = document.createElement("a");
    VUCaptionLink.href = VU.url;
    VUCaptionLink.textContent = VU.name;
    VUCaption.appendChild(VUCaptionLink);
    tableElement.appendChild(VUCaption);

    // Add table header
    const headerTableBody = document.createElement("tbody");
    tableElement.appendChild(headerTableBody);

    const headerTableRow = document.createElement("tr");
    ["Team", "Minute", "Outcome", "Umpire"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerTableRow.appendChild(th);
    })

    headerTableBody.appendChild(headerTableRow);

    // Add table content
    bodyTableRow = document.createElement("tbody");
    tableElement.appendChild(bodyTableRow);
    
    referrals = jsonData?.data?.events?.filter(e => e.event === "referral");

    referrals.forEach(referral => {
        const tr = document.createElement("tr");
        console.log(referral);
        minute = referral.minute;
        switch (referral.home_away) {
            case "home":
                team = homeTeamName;
                break;
            case "away":
                team = awayTeamName;
                break;
            default:
                team = "Team";
        }
        outcome = referral.outcome;

        umpire_designation = JSON.parse(referral.data)?.umpire ?? "";

        switch (umpire_designation) {
            case "U1":
                umpire = U1;
                break;
            case "U2":
                umpire = U2;
                break;
            case "RU":
                umpire = RU;
                break;
            case "VU":
                umpire = VU;
                break;
            default:
                umpire = {
                    name: "",
                    url: "#"
                }
        }

        [team, minute, outcome].forEach(text => {
            const td = document.createElement("td");
            td.textContent = text;
            tr.appendChild(td);
        })
        // Add umpire with link
        const td = document.createElement("td");
        const umpireLink = document.createElement("a");
        umpireLink.href = umpire.url;
        umpireLink.textContent = umpire.name;
        
        td.appendChild(umpireLink);
        tr.appendChild(td);

        bodyTableRow.appendChild(tr);
    })

    if (referrals.length == 0) {
        const tr = document.createElement("tr");

        const td = document.createElement("td");
        td.textContent = "No decisions referred";
        td.setAttribute("colspan", "4");
        tr.appendChild(td);
        bodyTableRow.appendChild(tr);
    }

    
})();
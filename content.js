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

    try {
        const jsonData = JSON.parse(rawJson);
        console.log("Extracted JSON: ", jsonData)
    } catch (error) {
        console.error("Failed to parse: ", error);
    }

    const events = jsonContent?.data?.events;
    if (!Array.isArray(events)) {
        console.warn("No events array found in jsonContent.data.events");
        return;
    }

    for (const event of events) {
        if (event.event === "card" && typeof event.data === "string") {
            try {
                const parsedData = JSON.parse(event.data);
                if (parsedData.narrative) {
                    console.log("Card narrative: ", parsedData.narrative);
                }
            } catch (e) {
            console.error("Failed to parse nested event/data JSON", e)
            }
        }   
    }
})();
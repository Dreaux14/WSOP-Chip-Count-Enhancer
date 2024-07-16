// Function to add columns and calculate BB values
function enhanceChipCounts() {
  // Get the blinds from the page
  const eventInfoText = document.querySelector(".eventinfo-progress").innerText;

  // Match blinds in the format 100/200, 500/1,000, 1,000/2,000, etc.
  const blindsMatch = eventInfoText.match(/Blinds:\s*([\d,]+)\/([\d,]+)/);
  if (!blindsMatch) {
    console.error("Blinds not found in the event info.");
    return;
  }

  const bigBlind = parseInt(blindsMatch[2].replace(/,/g, ""));

  // Get the chip count list
  const chipCountDiv = document.getElementById("chipcounts");
  const listItems = chipCountDiv.querySelectorAll("ul li");

  // Read data into an array
  const data = [];
  for (let i = 7; i < listItems.length; i += 7) {
    const placeItem = listItems[i];
    const playerItem = listItems[i + 1];
    const chipCountItem = listItems[i + 2];
    const trendItem = listItems[i + 3];
    const cityItem = listItems[i + 4];
    const stateItem = listItems[i + 5];
    const countryItem = listItems[i + 6];

    if (
      !placeItem ||
      !playerItem ||
      !chipCountItem ||
      !trendItem ||
      !cityItem ||
      !stateItem ||
      !countryItem
    ) {
      console.error("Missing data for a player. Skipping...");
      continue;
    }

    const place = placeItem.innerText;
    const player = playerItem.innerHTML; // Include innerHTML to retain flags
    const chipCount = parseInt(chipCountItem.innerText.replace(/,/g, ""));
    const trendText = trendItem.querySelector("span")
      ? trendItem.querySelector("span").innerText.replace(/[,+]/g, "").trim()
      : "0";
    const trend = trendText === "-" ? 0 : parseInt(trendText);
    const chipCountBB = (chipCount / bigBlind).toFixed(2);
    const trendBB = (trend / bigBlind).toFixed(2);
    const city = cityItem.innerText;
    const state = stateItem.innerText;
    const country = countryItem.innerText;

    data.push({
      place,
      player,
      chipCount,
      chipCountBB,
      trend,
      trendBB,
      city,
      state,
      country,
    });
  }

  // Remove the existing ul#chipcounts. Re-formatting existing data was an issue so removing and inserting a new table
  chipCountDiv.innerHTML = "";

  // Create a new table
  const newTable = document.createElement("table");
  newTable.id = "chipcountsTable";
  newTable.className = "custom-table";

  // Create and append header row
  const headerRow = newTable.insertRow();
  const headers = [
    "#",
    "Player",
    "Chip Count",
    "Chip Count (BB)",
    "Trend",
    "Trend (BB)",
    "City",
    "State",
    "Country",
  ];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    th.className = "titlebg"; // Retain the original styling class
    headerRow.appendChild(th);
  });

  // Create and append data rows
  data.forEach((row) => {
    const tr = newTable.insertRow();

    const placeCell = tr.insertCell();
    placeCell.innerText = row.place;
    placeCell.className = "place";

    const playerCell = tr.insertCell();
    playerCell.innerHTML = row.player; // Include innerHTML to retain flags
    playerCell.className = "player cellbg";

    const chipCountCell = tr.insertCell();
    chipCountCell.innerText = row.chipCount.toLocaleString(); // Format with commas
    chipCountCell.className = "chipstack";

    const chipCountBBCell = tr.insertCell();
    chipCountBBCell.innerText = row.chipCountBB;
    chipCountBBCell.className = "chipstackbb";

    const trendCell = tr.insertCell();
    trendCell.innerHTML = `<span style='color:${
      row.trend >= 0 ? "green" : "red"
    }'>${row.trend.toLocaleString()}</span>`; // Format with commas
    trendCell.className = "trends";

    const trendBBCell = tr.insertCell();
    trendBBCell.innerHTML = `<span style='color:${
      row.trend >= 0 ? "green" : "red"
    }'>${row.trendBB}</span>`;
    trendBBCell.className = "trendbb";

    const cityCell = tr.insertCell();
    cityCell.innerText = row.city;
    cityCell.className = "city";

    const stateCell = tr.insertCell();
    stateCell.innerText = row.state;
    stateCell.className = "state";

    const countryCell = tr.insertCell();
    countryCell.innerText = row.country;
    countryCell.className = "country";
  });

  // Append the new table to the chip count div
  chipCountDiv.appendChild(newTable);
}

// Run the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", enhanceChipCounts());

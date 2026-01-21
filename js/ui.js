import {addDays, dateStringToDate, dateToDateString} from "./date.js";

function getDateWarning(date) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (date < today) return "🔴";
	if (date.getTime() === today.getTime()) return "🟠";
	return "🟢";
}

function renderPlant(plant){

	const card = document.createElement("div");
	card.className = "plant-card";
	
	const header = document.createElement("div");
	header.className = "card-header";

	const title = document.createElement("h3");
	title.textContent = plant.name;

	const gear = document.createElement("button");
	gear.textContent = "⚙";

	header.appendChild(title);
	header.appendChild(gear);
	card.appendChild(header);

	// Plant image
	const img = document.createElement("img");
	img.className = "plant-image";
	img.src = plant.image;
	img.alt = `Image of ${plant.name}`;
	card.appendChild(img);

	// Last watered
	const lastWatered = document.createElement("p");
	const lastWateredDate = dateStringToDate(plant["last-watered"]);
	lastWatered.textContent = `Zuletzt gegossen: ${plant["last-watered"]}`;
	card.appendChild(lastWatered);

	// Next watering status
	const wateringDiv = document.createElement("div");
	wateringDiv.className = "status";

	const nextWatering = document.createElement("span");
	const nextWateringDate = addDays(lastWateredDate, plant["days-until-next-watering"]);
	nextWatering.textContent = `Nächster Gießtermin: ${dateToDateString(nextWateringDate)}`;

	const wateringStatus = document.createElement("span");
	wateringStatus.textContent = getDateWarning(nextWateringDate);

	wateringDiv.appendChild(nextWatering);
	wateringDiv.appendChild(wateringStatus);
	card.appendChild(wateringDiv);

	// Last fertilised
	const lastFertilized = document.createElement("p");
	const lastFertilizedDate = dateStringToDate(plant["last-fertilized"]);
	lastFertilized.textContent = `Zuletzt gedüngt: ${plant["last-fertilized"]}`;
	card.appendChild(lastFertilized);

	// Next fertilization status
	const fertilizationDiv = document.createElement("div");
	fertilizationDiv.className = "status";

	const nextFertilization = document.createElement("span");
	const nextFertilizationDate = addDays(lastFertilizedDate, plant["days-until-next-fertilization"]);
	
	nextFertilization.textContent = `Nächster Düngtermin: ${dateToDateString(nextFertilizationDate)}`;

	const fertilizationStatus = document.createElement("span");
	fertilizationStatus.textContent = getDateWarning(nextFertilizationDate);

	fertilizationDiv.appendChild(nextFertilization);
	fertilizationDiv.appendChild(fertilizationStatus);
	card.appendChild(fertilizationDiv);

	// Actions
	const actions = document.createElement("div");
	actions.className = "actions";

	const waterBtn = document.createElement("button");
	waterBtn.textContent = "Gießen";
	waterBtn.className = "water-btn";
	
	const fertilizeBtn = document.createElement("button");
	fertilizeBtn.textContent = "Düngen";
	fertilizeBtn.className = "fert-btn";

	actions.appendChild(waterBtn);
	actions.appendChild(fertilizeBtn);

	card.appendChild(actions);
	return card;
}

export function renderPlants(plants){
	const container = document.getElementById("plant-container");
	container.innerHTML = "";
	plants.forEach(plant => {
		container.appendChild(renderPlant(plant));
	});
}

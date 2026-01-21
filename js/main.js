import {addPlant, clearPlants, getPlants, editPlant, deletePlant} from "./api.js";
import {renderPlants} from "./ui.js";
import {dateToDateString} from "./date.js";

const modal = document.getElementById("editModal");
const closeBtn = modal.querySelector(".close");
const form = document.getElementById("editPlantForm");
const addButton = document.getElementById("addButton");
const clearButton = document.getElementById("clearButton");

function openEditModal(plant) {
	modal.style.display = "block";
	if (plant != null){
		form.oldName.value = plant.name;
		form.name.value = plant.name;
		form.image.value = plant.image;
		form.daysUntilWatering.value = plant["days-until-next-watering"];
		form.daysUntilFertilization.value = plant["days-until-next-fertilization"];
		
		form.dataset.plantName = plant.name;
	} else{
		form.oldName.value = "";
		form.name.value = "";
		form.image.value = "";
		form.daysUntilWatering.value = 1;
		form.daysUntilFertilization.value = 1;

		form.dataset.plantName = "newPlant";
	}
}

closeBtn.onclick = () => {
	modal.style.display = "none";
};

window.onclick = (e) => {
	if (e.target == modal) {
		modal.style.display = "none";
	}
};

async function load(){
	await refresh();

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const oldName = form.oldName.value;
		if (oldName === ""){
			const today = new Date();
			const newPlant = {
				name: form.name.value,
				image: form.image.value,
				"days-until-next-watering": parseInt(form.daysUntilWatering.value),
				"days-until-next-fertilization": parseInt(form.daysUntilFertilization.value),
				"last-fertilized": dateToDateString(today),
				"last-watered": dateToDateString(today),
			};
			await addPlant(newPlant);

		} else {
			const newPlant = {
				name: form.name.value,
				image: form.image.value,
				"days-until-next-watering": parseInt(form.daysUntilWatering.value),
				"days-until-next-fertilization": parseInt(form.daysUntilFertilization.value)
			};
			await editPlant(oldName, newPlant);
		}
		refresh();

		modal.style.display = "none";
	});
	deleteButton.addEventListener("click", async (e) => {
		const plantName = form.dataset.plantName;
		if (plantName !== "newPlant"){
			await deletePlant(plantName);
			modal.style.display = "none";
			refresh();
		}
	});

	addButton.addEventListener("click", async (e) => {
		openEditModal(null);
	});
	
	clearButton.addEventListener("click", async (e) => {
		if (confirm("Möchtest du wirklich alle Pflanzen entfernen?")){
			await clearPlants();
			await refresh();
		}
	});
}

async function refresh(){
	const plants = await getPlants();
	await renderPlants(plants);
	
	document.querySelectorAll(".plant-card .card-header button").forEach((btn, index) => {
		btn.addEventListener("click", () => {
			const plantCard = btn.closest(".plant-card");
			const plantName = plantCard.querySelector("h3").textContent;
			
			const plant = plants.find(p => p.name === plantName);
			if (typeof plant !== 'undefined'){
				openEditModal(plant);
			}
		});
	});
	document.querySelectorAll(".plant-card .actions .water-btn").forEach((btn, index) => {
		btn.addEventListener("click", async (e) => {
			const plantCard = btn.closest(".plant-card");
			const plantName = plantCard.querySelector("h3").textContent;
			
			const plant = plants.find(p => p.name === plantName);
			if (typeof plant !== 'undefined'){
				plant["last-watered"] = dateToDateString(new Date());
				await editPlant(plant.name, plant);
				await refresh();
			}
		});
	});
	document.querySelectorAll(".plant-card .actions .fert-btn").forEach((btn, index) => {
		btn.addEventListener("click", async (e) =>{
			const plantCard = btn.closest(".plant-card");
			const plantName = plantCard.querySelector("h3").textContent;
			
			const plant = plants.find(p => p.name === plantName);
			if (typeof plant !== 'undefined'){
				plant["last-fertilized"] = dateToDateString(new Date());
				await editPlant(plant.name, plant);
				await refresh();
			}
		});
	});
}

window.addEventListener("DOMContentLoaded", load);

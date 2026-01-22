function getApiUrl(){
	console.log(location.hostname);
	const base = (location.hostname !== "localhost")
		  ? "http://localhost:8787"
	      : "https://worker.oliplant.workers.dev";
	return base + "/plants";
}

const URL = getApiUrl();

export async function getPlants(){
	console.log("Fetching plants..");
	const response = await fetch(URL, {method: "GET"});
	const json = await response.json();
	return json.plants;
}

export async function clearPlants(){
	console.log("Clearing plants..");
	const response = await fetch(URL, {
		method: "DELETE",
		body: JSON.stringify({name: "ALL"}),
	});
	const json = await response.json();
	if (!json.ok){
		alert("Failed to clear plants!");
	}
}

export async function deletePlant(plantName){
	console.log("Deleting plant " + plantName + "..");
	const response = await fetch(URL, {
		method: "DELETE",
		body: JSON.stringify({name: plantName}),
	});
	const json = await response.json();
	if (!json.ok){
		alert("Failed to delete plant!");
	}
}

export async function editPlant(oldName, plant){
	console.log("Editing plant " + oldName + "..");
	const response = await fetch(URL, {
		method: "PUT",
		body: JSON.stringify({name: oldName, update: plant}),
	});
	const json = await response.json();
	if (!json.ok){
		alert("Failed to update plants!");
	}
}

export async function addPlant(plant){
	console.log("Adding plant " + plant.name + "..");
	const response = await fetch(URL, {
		method: "POST",
		body: JSON.stringify(plant),
	});
	const json = await response.json();
	if (!json.ok){
		alert("Failed to add new plant!");
	}
}
	

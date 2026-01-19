const URL = "https://worker.oliplant.workers.dev/plants";

export async function getPlants(){
	const response = await fetch(URL, {method: "GET"});
	const json = await response.json();
	return json.plants;
}

export async function clearPlants(){
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
	console.log("Deleting " + plantName);
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
	console.log("editing");
	console.log(oldName);
	console.log(plant);
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
	const response = await fetch(URL, {
		method: "POST",
		body: JSON.stringify(plant),
	});
	const json = await response.json();
	if (!json.ok){
		alert("Failed to add new plant!");
	}
}
	

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (!url.pathname.startsWith("/plants")) {
			return new Response("Not found", { status: 404 });
		}

		// Read current data from KV
		const stored = await env.PLANTS.get("data", { type: "json" });
		let data = stored ?? { plants: [] };

		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type"
				}
			});
		}

		if (request.method === "GET") {
			return json(data);
		}

		if (request.method === "POST") {
			// Add new plant
			const newPlant = await request.json();
			data.plants.push(newPlant);
			await env.PLANTS.put("data", JSON.stringify(data));
			return json({ ok: true, data });
		}

		if (request.method === "PUT") {
			// Edit plant by name
			const change = await request.json();
			const oldName = change.name;
			const update = change.update;
			const index = data.plants.findIndex(p => p.name === oldName);
			if (index === -1) {
				return json({ ok: false, error: "Plant not found" }, 404);
			}
			// Replace fields
			data.plants[index] = { ...data.plants[index], ...update };
			await env.PLANTS.put("data", JSON.stringify(data));
			return json({ ok: true, data });
		}

		if (request.method === "DELETE") {
			let name;
			try {
				const change = await request.json();
				name = change.name;
			} catch {
				return json({ ok: false, error: "Missing or invalid JSON body" }, { status: 400 });
			}

			const list = await env.PLANTS.list();
			const jsonString = await env.PLANTS.get("data");
			const data = JSON.parse(jsonString);
			if (name === "ALL") {
				// Delete all keys in parallel
				await Promise.all(list.keys.map(key => env.PLANTS.delete(key.name)));
			} else {
				// Get the current plants
				const jsonString = await env.PLANTS.get("data");
				if (!jsonString) return json({ ok: false, error: "No plants found" });

				const data = JSON.parse(jsonString);

				// Remove the plant with the matching name
				data.plants = data.plants.filter(plant => plant.name !== name);

				// Save back the updated list
				await env.PLANTS.put("data", JSON.stringify(data));
			}

			return json({ ok: true });
		}

		return new Response("Method not allowed", { status: 405 });
	}
};

function json(obj, status = 200) {
	const headers = new Headers({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type"
	});
	return new Response(JSON.stringify(obj), { status, headers });
}

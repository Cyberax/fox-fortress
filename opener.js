browser.runtime.onMessage.addListener(notify);

async function notify(message, sender) {
	var acctName = message.name;
	var roleName = message.role;
	var radioactive = true;
	if (roleName === "Administrator") {
		roleName = "adm";
	}
	if (roleName === "ReadOnly") {
		roleName = "ro";
		radioactive = false;
	}
	const isProd = acctName.endsWith("-prod") || acctName === "master";

	const containerName = roleName + ":" + acctName;

	const identity = await browser.contextualIdentities.query({"name": containerName});
	var store;
	if (identity.length == 0) {
		var color = "yellow";
		var icon = "briefcase";
		if (isProd) {
			icon = "dollar";
			if (radioactive) {
				color = "red";				
			} else {
				color = "orange";
			}
		} else {
			color = "green";
		}

		store = await browser.contextualIdentities.create({
 			name: containerName,
			color: color,
			icon: icon
		});
	} else {
		const cookieStoreId = identity[0].cookieStoreId;
		store = await browser.contextualIdentities.get(cookieStoreId);
	}

	const curTab = sender.tab;

	let newTab = await browser.tabs.create({
		active: false,
		cookieStoreId: store.cookieStoreId,
		url: message.url,
		index: curTab.index
	})

	await browser.tabs.remove(curTab.id); // Remove the opening tab
}



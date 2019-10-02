const fs = require('fs');
const tmi = require('tmi.js');

const Aggregator = require('./aggregator.js');

let aggregator = new Aggregator();
aggregator.on("tick", onTick);

let config = fs.readFileSync('./config.json');
config = JSON.parse(config);

const client = new tmi.client({
	identity: {
		username: config.username,
		password: config.password
	},
	channels: [config.channel]
});

client.on('message', onMessageHandler);
client.connect();
aggregator.run();

console.log("Connected to Twitch channel: " + config.channel);

function onMessageHandler (target, context, msg, self) {
	if (self) { return; }
	// client.say(target, "Message to appear");
	const cmd = msg.trim();
	aggregator.parse(cmd);
}

function onTick(vote) {
	console.log("Robot is moving: " + vote.name);
}

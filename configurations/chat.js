var Config = module.exports = {
	//---------------------
	//Main Configurations
	//---------------------
	enableLogging: process.env.MV_CHAT_ENABLE_LOGGING || false,
	profanityFilter: process.env.MV_CHAT_PROFANITY_FILTER || false,
};

var Imported = Imported || {};
Imported.Online_Metrics = true;
var Nasty = Nasty || {};

(function () {
//=============================================================================
// Online Metrics
// Version: 1.0.1
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Very simple netwokred metrics for your game.
 *<Online_Metrics>
 *
 * Requires Oniline Main Core and Server side setup to use.
 * @author Nelderson
 *
 * @param Anonymous
 * @desc If false requires users to be logged in with Login_Core
 * @default true
 *
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 *  Metrics allow you to store game data that you can use to project
 *  and show trends within your game.
 *
 *  REQUIRES: Online_Main_Core
 *
 * There are two ways to send metrics to your database:
 *
 *
 * 1. Plugin Command: SendMetrics <location>
 *
 *  This plugin command will send the default metrics derfined under
 *  the default_metrics function in the plugin js file.  Feel free to
 *  change the default values to match your game.
 *
 *  <location> is the location where this is taking place for future reference.
 *
 *  Ex. SendMetrics AfterBossBattle
 *
 * 2. Script Call: $gameSystem.sendMetrics(data);
 *
 *  This script call passes a data object that is then uploaded to the database.
 *  The data object can hold any arbitrary data you want.
 *
 *  Ex. $gameSystem.sendMetrics({
 *        goblin_kill_count = $gameVariables.value(35);
 *        save_count: $gameSystem._saveCount,
 *        escape_count: $gameSystem._escapeCount,
 *        battle_count: $gameSystem._battleCount,
 *        location: "AfterGoblinBattle"
 *   });
 *
 */
 //=============================================================================

 var default_metrics =function() {
   return{
     save_count: $gameSystem._saveCount,
     playtime: $gameSystem.playtime(),
     battle_count: $gameSystem._battleCount,
     win_count: $gameSystem._winCount,
     escape_count: $gameSystem._escapeCount,
     actors: $gameParty._actors,
     gold: $gameParty._gold,
     save_slot: DataManager.latestSavefileId()
   };
 };

 Nasty.Parameters = $plugins.filter(function(p)
    { return p.description.contains('<Online_Metrics>');})[0].parameters;

var anonymousBool = Nasty.Parameters['Anonymous'];

var Online_Metrics_plugin_command = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Online_Metrics_plugin_command.call(this,command, args);
  if (command.toUpperCase() === 'SENDMETRICS') {
    $gameSystem.sendMetricsFromPlugin(args[0]);
  }
};

var Nel_Metrics_GS_init_Alias = Game_System.prototype.initialize;

 Game_System.prototype.initialize = function(){
   Nel_Metrics_GS_init_Alias.call(this);
   this._metricsID = 'false';
 };

Game_System.prototype.sendMetrics = function(data){
  data.id = $gameSystem._metricsID;
  $.post($gameNetwork._serverURL+'/metrics/datadump', data).done(function(data){
    if (anonymousBool==='true'){
      $gameSystem._metricsID = data;
    }
  });
};

Game_System.prototype.sendMetricsFromPlugin = function(data){
  var metrics = default_metrics();
  metrics.location = data;
  metrics.id = $gameSystem._metricsID;
  $.post($gameNetwork._serverURL+'/metrics/datadump', metrics).done(function(data){
    if (anonymousBool==='true'){
      $gameSystem._metricsID = data;
    }
  });
};
})();

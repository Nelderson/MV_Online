(function () {
//=============================================================================
// Online Metrics
// Version: 1.0.0
//=============================================================================
var Imported = Imported || {};
Imported.Nel_Metrics = true;

var Nasty = Nasty || {};
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
 * $gameSystem._saveCount
 * $gameSystem.playtime();
 * $gameSystem._battleCount
 * $gameSystem._winCount
 * $gameSystem._escapeCount
 * $gameVariables.value(varID)
 * $gameParty._actors
 * $gameParty._gold
 * $gameParty._steps
 * $gameParty.items()
 * $gameParty.weapons()
 * $gameParty.armors()
 * $gameParty.allItems()
 * DataManager.latestSavefileId()
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
  $.post($gameNetwork._serverURL+'/metrics/datadump', data);
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

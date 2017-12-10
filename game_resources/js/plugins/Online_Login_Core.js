var Imported = Imported || {};
Imported.Online_Login_Core = true;

(function () {
var Nasty = Nasty || {};
//=============================================================================
// Online Login Core
// Version: 1.1.5 - Added Password Reset Logic
// Version: 1.1.4 - Added event switches for when users login multiple times
// Version: 1.1.3
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Login window for Neldersons Online Core
 *<Online_Login_Core>
 * @author Nelderson and SirMcPotato/Vinxce
 *
 * @param Force Login on Startup
 * @desc Make the title screen into a login screen
 * @default true
 *
 * @param socket.io connection
 * @desc Automatically connects to socket once signed in.
 * @default true
 *
 * @param Switch on First Shutdown
 * @desc Original user that is logged in will have this switch flipped
 * @default 1
 *
 * @param Switch on Second Shutdown
 * @desc Second user that is logged in will have this switch flipped
 * @default 2
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * You can use the login window in two ways.
 *
 *  1.  Set Force login on Startup parameter to true:
 *      This will force the login screen on startup.
 *
 *  2.  Set Force login on Startup parameter to false:
 *      You can use this plugin command to pop up the
 *      login window at any point in your game:
 *
 *         Online_Login
 *
 *   The socket.io connection parameter refers to if you
 *   want to automatically upgrade to sockets after login.
 *
 */
 //=============================================================================
 Nasty.Parameters = $plugins.filter(function(p)
		{ return p.description.contains('<Online_Login_Core>');})[0].parameters;


		var Nel_online_login_core_plugincomm_alias = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Nel_online_login_core_plugincomm_alias.call(this, command, args);
        if (command.toUpperCase() === 'ONLINE_LOGIN') {
					if ($gameNetwork._token===0){
						SceneManager.goto(MMO_Scene_Title);
					}
        }
      };

	//----------------------------------------------------------------------------
	// MMO_Scene_Title
	//
	// Title scene including login form.
  //----------------------------------------------------------------------------

	function MMO_Scene_Title() {
	    this.initialize.apply(this, arguments);
	}

	MMO_Scene_Title.prototype = Object.create(Scene_Base.prototype);
	MMO_Scene_Title.prototype.constructor = MMO_Scene_Title;

	MMO_Scene_Title.prototype.initialize = function() {
	    Scene_Base.prototype.initialize.call(this);
	};

	MMO_Scene_Title.prototype.reBindInput = function() {
		Input.initialize();
	};

	MMO_Scene_Title.prototype.create = function() {
	    Scene_Base.prototype.create.call(this);
	    this.createBackground();
	};

	MMO_Scene_Title.prototype.start = function() {
	    Scene_Base.prototype.start.call(this);
	    SceneManager.clearStack();
	    this.playTitleMusic();
	    this.startFadeIn(this.fadeSpeed(), false);
	    this.createLoginForm();
	};

	MMO_Scene_Title.prototype.update = function() {
	    Scene_Base.prototype.update.call(this);
	};

	MMO_Scene_Title.prototype.isBusy = function() {
	    return Scene_Base.prototype.isBusy.call(this);
	};

	MMO_Scene_Title.prototype.terminate = function() {
	    Scene_Base.prototype.terminate.call(this);
	    SceneManager.snapForBackground();
	};


	MMO_Scene_Title.prototype.createRegistrationForm = function() {
		$("#ErrorPrinter").html(
			'<div id="RegisterForm" class="panel panel-primary" style="width:'+(Graphics.boxWidth - (Graphics.boxWidth / 3))+'px">'+
				'<div class="panel-heading">Register</div>'+
				'<div class="panel-body">'+
					'<div id="loginErrBox"></div>'+
  				'<div class="form-group">'+
    				'<input type="text" id="regUsername" name="username" placeholder="Enter Username" class="form-control"/>'+
  				'</div>'+
  					'<div class="form-group">'+
    			'<input type="text" name="email" id="regEmail"  placeholder="Email Address" class="form-control"/>'+
  				'</div>'+
  					'<div class="form-group">'+
    			'<input type="password" name="password" id="regPassword" placeholder="Password" class="form-control"/>'+
  					'</div>'+
  					'<button id="btnSubmit"type="submit" class="btn btn-default">Submit</button>'+
						'<button id ="btnCancel" type="button" class="btn btn-primary">Cancel</button>'+
				'</div>'+
			'</div>');

			var that = this;
			$(".form-control").keypress(function(e){
				if (e.which == 13) { //enter
					that.registerAttempt();
				}
			});
      $("#regUsername").tap(function(){$("#regUsername").focus();});
      $("#regEmail").tap(function(){$("#regEmail").focus();});
      $("#regPassword").tap(function(){$("#regPassword").focus();});
      $("#btnSubmit").bind("click touchstart",function(){that.registerAttempt();});
      $("#btnCancel").bind("click touchstart",function(){that.createLoginForm();});

		};
	// Testing purpose, need to be rewritten into something more modulable,
	// maybe using template file?
	// Can be wise to work on a set of sprite-based form inputs for
	// a better visual integration.
	MMO_Scene_Title.prototype.createLoginForm = function() {
		$("#ErrorPrinter").html(
			'<div id="LoginForm" class="panel panel-primary" style="width:'+(Graphics.boxWidth - (Graphics.boxWidth / 3))+'px">'+
				'<div class="panel-heading">Login</div>'+
				'<div class="panel-body">'+
					'<div id="loginErrBox"></div>'+
					'<div class="input-group">'+
						'<span class="input-group-addon" id="username-addon"><i class="fa fa-user"></i></span>'+
						'<input type="text" class="form-control login-input" id="inputUsername" placeholder="Username" aria-describedby="username-addon">'+
					'</div><br>'+
					'<div class="input-group">'+
						'<span class="input-group-addon" id="password-addon"><i class="fa fa-lock"></i></span>'+
						'<input type="password" class="form-control login-input" id="inputPassword" placeholder="Password" aria-describedby="password-addon">'+
					'</div><br>'+
					'<button id="btnConnect" class="btn btn-primary">Connect</button>'+
					'<button id="btnRegister" class="btn btn-default">Register</button>'+
          '<button id="btnForgotPassword" class="btn btn-link btn-sm">Forgot Password?</button>'+
				'</div>'+
			'</div>');

		//Bind commands
		var that = this;
		$(".login-input").keypress(function(e){
			if (e.which == 13) { //enter
				that.connectAttempt();
			}
		});
    $("#inputUsername").tap(function(){$("#inputUsername").focus();});
    $("#inputPassword").tap(function(){$("#inputPassword").focus();});
		$("#btnConnect").bind("click touchstart",function(){that.connectAttempt();});
		$("#btnRegister").bind("click touchstart",function(){that.createRegistrationForm();});
    $("#btnForgotPassword").bind("click touchstart",function(){that.createLostPasswordForm();});
    $("#inputUsername").focus();
	};

	MMO_Scene_Title.prototype.createActivationForm = function() {
		$("#ErrorPrinter").html(
			'<div id="ActivationForm" class="panel panel-primary" style="width:'+(Graphics.boxWidth - (Graphics.boxWidth / 3))+'px">'+
				'<div class="panel-heading">Activation</div>'+
				'<div class="panel-body">'+
					'<div id="loginErrBox"></div>'+
					'<div class="input-group">'+
					'</div><br>'+
					'<button id="btnActLogin" class="btn btn-primary">Login</button>'+
				'</div>'+
			'</div>');

		//Bind commands
		var that = this;
		$(".login-input").keypress(function(e){
			if (e.which == 13) { //enter
				that.createLoginForm();
			}
		});
    $("#btnActLogin").bind("click touchstart",function(){that.createLoginForm();});
	};

	MMO_Scene_Title.prototype.displayError = function(msg) {
		$("#loginErrBox").html('<div class="alert alert-danger fade in">'+msg+'</div>');
	};

	MMO_Scene_Title.prototype.displayInfo = function(msg) {
		$("#loginErrBox").html('<div class="alert alert-info fade in">'+msg+'</div>');
	};

  MMO_Scene_Title.prototype.displaySuccess = function(msg) {
		$("#loginErrBox").html('<div class="alert alert-success fade in">'+msg+'</div>');
	};

  MMO_Scene_Title.prototype.createLostPasswordForm = function() {
		$("#ErrorPrinter").html(
			'<div id="LostPasswordFrom" class="panel panel-primary" style="width:'+(Graphics.boxWidth - (Graphics.boxWidth / 3))+'px">'+
				'<div class="panel-heading">Lost Password - Enter Email</div>'+
				'<div class="panel-body">'+
					'<div id="loginErrBox"></div>'+
  					'<div class="form-group">'+
    			'<input type="text" name="email" id="inputEmailLP"  placeholder="Email Address" class="form-control"/>'+
  				'</div>'+
  					'<button id="btnSubmitLP"type="submit" class="btn btn-primary">Submit</button>'+
						'<button id ="btnCancelLP" type="button" class="btn btn-default">Cancel</button>'+
				'</div>'+
			'</div>');

			var that = this;
			$(".form-control").keypress(function(e){
				if (e.which == 13) { //enter
					that.lostPasswordRequest();
				}
			});
      $("#inputEmailLP").tap(function(){$("#inputEmailLP").focus();});
      $("#btnSubmitLP").bind("click touchstart",function(){that.lostPasswordRequest();});
      $("#btnCancelLP").bind("click touchstart",function(){that.createLoginForm();});
      $("#inputEmailLP").focus();
		};

    MMO_Scene_Title.prototype.createResetPasswordForm = function() {
  		$("#ErrorPrinter").html(
  			'<div id="PasswordResetForm" class="panel panel-primary" style="width:'+(Graphics.boxWidth - (Graphics.boxWidth / 3))+'px">'+
  				'<div class="panel-heading">Password Reset</div>'+
  				'<div class="panel-body">'+
  					'<div id="loginErrBox"></div>'+
    					'<div class="form-group">'+
      			'<input type="password" name="password" id="inputPasswordCP"  placeholder="New Password" class="form-control"/>'+
    				'</div>'+
            '<div class="form-group">'+
          '<input type="password" name="password" id="inputPasswordConfirmCP"  placeholder="Confirm Password" class="form-control"/>'+
          '</div>'+
    					'<button id="btnChangeCP"type="submit" class="btn btn-primary">Change</button>'+
  						'<button id ="btnCancelCP" type="button" class="btn btn-default">Cancel</button>'+
  				'</div>'+
  			'</div>');

  			var that = this;
  			$(".form-control").keypress(function(e){
  				if (e.which == 13) { //enter
  					that.changePasswordRequest();
  				}
  			});
        $("#inputPasswordCP").tap(function(){$("#inputEmailLP").focus();});
        $("#inputPasswordConfirmCP").tap(function(){$("#inputEmailLP").focus();});
        $("#btnChangeCP").bind("click touchstart",function(){that.changePasswordRequest();});
        $("#btnCancelCP").bind("click touchstart",function(){that.createLoginForm();});
        $("#inputPasswordCP").focus();
  		};

      MMO_Scene_Title.prototype.changePasswordRequest = function(){
    		var that = this;
        var pass1 = $("#inputPasswordCP").val();
        var pass2 = $("#inputPasswordConfirmCP").val();
        if (pass1.length === 0)
    			return this.displayError("You must provide a new password!");
        if (pass2.length === 0)
      		return this.displayError("You must confirm your password!");
        if (pass1!==pass2)
          return this.displayError("Passwords do not match!");
        this.displayInfo('Connecting <i class="fa fa-spin fa-spinner"></i>');

        shapwd = CryptoJS.SHA1(pass1+$gameNetwork._firstHash).toString(CryptoJS.enc.Hex);

        $.post($gameNetwork._serverURL+'/resetpassword', {
            password: shapwd,
            tempHash: $gameSystem._tempPasswordHash,
            tempName: $gameSystem._tempPasswordName
          }).done(function (data) {
            if (data.err) return that.displayError("Error : "+data.err);
            that.createLoginForm();
            that.displaySuccess("Password Changed Successfully");
          });
      };

    MMO_Scene_Title.prototype.lostPasswordRequest = function(){
  		var that = this;
  		var email = $("#inputEmailLP").val();
      if (email.length === 0)
  			return this.displayError("You must provide a username!");
      this.displayInfo('Connecting <i class="fa fa-spin fa-spinner"></i>');

      $.post($gameNetwork._serverURL+'/lostpassword', {
        email: email,
      }).done(function (data) {
        if (data.err) return that.displayError("Error : "+data.err);
        that.createLoginForm();
        that.displayInfo("Check email for temporary password");
      });
    };

	MMO_Scene_Title.prototype.connectAttempt = function(){
		var that = this;
		var username = $("#inputUsername").val();
		var password = $("#inputPassword").val();

		if (username.length === 0)
			return this.displayError("You must provide a username!");
		if (password.length === 0)
			return this.displayError("You must provide a password!");

		shapwd = CryptoJS.SHA1(password+$gameNetwork._firstHash).toString(CryptoJS.enc.Hex);
		this.displayInfo('Connecting <i class="fa fa-spin fa-spinner"></i>');
        $.post($gameNetwork._serverURL+'/login', {
					username: username,
					password: shapwd
      }).done(function (data) {
				if (data.err)
						return that.displayError("Error : "+data.err);
        if (data.temp){
          //Make Password reset form
          $gameSystem._tempPasswordName = data.name;
          $gameSystem._tempPasswordHash = data.temp;
          that.createResetPasswordForm();
        }
					if (data.token) {
						$gameNetwork._token = data.token;
						var ioFlag = String(Nasty.Parameters['socket.io connection']);
						$("#ErrorPrinter").fadeOut({duration: 1000}).html("");
            if (ioFlag==='true'){
							$gameNetwork.connectSocket('main','/');
              $gameNetwork._socket.main.on('firstShutDown',function(data){
                $gameSwitches.setValue(Number(Nasty.Parameters['Switch on First Shutdown']),true);
              });
              $gameNetwork._socket.main.on('secondShutDown',function(data){
                $gameSwitches.setValue(Number(Nasty.Parameters['Switch on Second Shutdown']),true);
              });
						}
            $gameNetwork.connectSocketsAfterLogin();
            that.fadeOutAll();
					  SceneManager.goto(Scene_Map);
						return that.displayInfo("Ok : "+data.msg);
					}
      });
	};

	MMO_Scene_Title.prototype.registerAttempt = function(){
		var that = this;
		var username = $("#regUsername").val();
		var password = $("#regPassword").val();
		var email = $("#regEmail").val();
		if (username.length === 0) return this.displayError("You must provide a username!");
		if (password.length === 0) return this.displayError("You must provide a password!");
		if (email.length === 0) return this.displayError("You must provide a valid Email!");

		this.displayInfo('Connecting <i class="fa fa-spin fa-spinner"></i>');

		//POST FOR REGISTER
		$.post($gameNetwork._serverURL + '/register', {
			username: username,
			password: password,
			email: email
	}).done(function (result) {
		var data = result.pageData;
		if (data.err)
			return that.displayError("Error : "+data.err);
		if (data.msg) {
				that.createActivationForm();
			that.displayInfo("Check your email for the activation link!");
		}
	});
	};

	MMO_Scene_Title.prototype.createBackground = function() {
		var startupFlag = String(Nasty.Parameters['Force Login on Startup']);
		if (startupFlag==='true'){
	    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
	    this.addChild(this._backSprite1);
	    this.addChild(this._backSprite2);
			this.centerSprite(this._backSprite1);
	    this.centerSprite(this._backSprite2);
			this.createForeground();
		}else{
			this._backgroundSprite = new Sprite();
	    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
	    this.addChild(this._backgroundSprite);
		}
	};

	MMO_Scene_Title.prototype.createForeground = function() {
	    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
	    this.addChild(this._gameTitleSprite);
	    if ($dataSystem.optDrawTitle) {
	        this.drawGameTitle();
	    }
	};

	MMO_Scene_Title.prototype.drawGameTitle = function() {
	    var x = 20;
	    var y = Graphics.height / 4;
	    var maxWidth = Graphics.width - x * 2;
	    var text = $dataSystem.gameTitle;
	    this._gameTitleSprite.bitmap.outlineColor = 'black';
	    this._gameTitleSprite.bitmap.outlineWidth = 8;
	    this._gameTitleSprite.bitmap.fontSize = 72;
	    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
	};

	MMO_Scene_Title.prototype.centerSprite = function(sprite) {
	    sprite.x = Graphics.width / 2;
	    sprite.y = Graphics.height / 2;
	    sprite.anchor.x = 0.5;
	    sprite.anchor.y = 0.5;
	};

	MMO_Scene_Title.prototype.playTitleMusic = function() {
	    AudioManager.playBgm($dataSystem.titleBgm);
	    AudioManager.stopBgs();
	    AudioManager.stopMe();
	};

  //----------------------------------------------------------------------------
	//
	// Override of Scene_Boot.start, for calling our own Scene_Title!
	//

var Nel__SceneBase_Boot_alias_MMO_Login = Scene_Boot.prototype.start;

	Scene_Boot.prototype.start = function() {
		var startupFlag = String(Nasty.Parameters['Force Login on Startup']);
		if (startupFlag==='false'){
			Nel__SceneBase_Boot_alias_MMO_Login.call(this);
		}
		else{
	    Scene_Base.prototype.start.call(this);
	    SoundManager.preloadImportantSounds();
	    if (DataManager.isBattleTest()) {
	        DataManager.setupBattleTest();
	        SceneManager.goto(Scene_Battle);
	    } else if (DataManager.isEventTest()) {
	        DataManager.setupEventTest();
	        SceneManager.goto(Scene_Map);
	    } else {
	        this.checkPlayerLocation();
	        DataManager.setupNewGame();
	        SceneManager.goto(MMO_Scene_Title);
	    }
	    this.updateDocumentTitle();
		}
	};

    //-----------------------------------------------------------------------------
	//
	// Overriding 'Input._onKeyDown' to pass 'event' as parameter
	// to 'Input._shouldPreventDefault'
	//

	Input._onKeyDown = function(event) {
	    if (this._shouldPreventDefault(event)) {
	        event.preventDefault();
	    }
	    if (event.keyCode === 144) {    // Numlock
	        this.clear();
	    }
	    var buttonName = this.keyMapper[event.keyCode];
	    if (buttonName) {
	        this._currentState[buttonName] = true;
	    }
	};

    //-----------------------------------------------------------------------------
	//
	// Overriding Input._shouldPreventDefault to allow the use of the 'backspace key'
	// in input forms.
	//

	Input._shouldPreventDefault = function(e) {
	    switch (e.keyCode) {
		    case 8:     // backspace
		    	if ($(e.target).is("input, textarea"))
		    		break;
		    case 33:    // pageup
		    case 34:    // pagedown
		    case 37:    // left arrow
		    case 38:    // up arrow
		    case 39:    // right arrow
		    case 40:    // down arrow
		        return true;
	    }
	    return false;
	};


})();

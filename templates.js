angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root">\n    <div ui-view></div>\n</div>\n');
$templateCache.put('./app.html','<div class="root">\n    <!-- <app-nav user="$ctrl.user" on-logout="$ctrl.logout();"></app-nav> -->\n    <!-- <md-sidenav flex-order="2" md-component-id="side" md-whiteframe="3" md-disable-backdrop class="md-sidenav-right md-no-pagination app__sidenav--height app__sidenav--width app__sidenav--position app__sidenav--overflow-x">\n        <div ui-view="side"></div>\n    </md-sidenav> -->\n    <div>\n        <div ui-view></div>\n    </div>\n</div>\n');
$templateCache.put('./auth.html','  <md-content class="background height--full width--full" layout="column" layout-align="center center">\n\n    <div>\n      <img src="img/mughub_logo.png" width="200px" />\n    </div>\n\n    <div class="width--full auth--animation ng-enter" style="margin-top: -30px;">\n      <md-tabs class="auth__tabContainer width--full md-no-animation" md-center-tabs="true">\n\n        <md-tab label="STUDENT">\n          <md-content class="background">\n              <login ng-if="$ctrl.showLogin" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset()" user-type="STUDENT"></login>\n              <register ng-if="$ctrl.showRegister" on-login="$ctrl.toggleRegister()" user-type="STUDENT"></register>\n              <reset ng-if="$ctrl.showReset" on-login="$ctrl.toggleLogin()" user-type="STUDENT"></reset>\n          </md-content>\n        </md-tab>\n\n        <md-tab label="TUTOR">\n          <md-content class="background auth--animation ng-enter">\n              <login ng-if="$ctrl.showLogin" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset($event)" user-type="TUTOR"></login>\n              <register ng-if="$ctrl.showRegister" on-login="$ctrl.toggleRegister()" user-type="TUTOR"></register>\n              <reset ng-if="$ctrl.showReset" on-login="$ctrl.toggleLogin()" user-type="TUTOR"></reset>\n          </md-content>\n        </md-tab>\n\n      </md-tabs>\n    </div>\n\n  </md-content>\n');
$templateCache.put('./memos.html','<div>\n  This is the app.\n</div>\n');
$templateCache.put('./auth-form.html','<form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.submitForm();">\n  <md-list layout="column" layout-align="center center">\n\n    <div>\n      <md-list-item>\n        <md-input-container layout="row" layout-align="center center" class="auth__input">\n          <label style="color:  #eaeaea; font-size: 13px; font-family: \'Montserrat\', sans-serif; padding: 5px 0px 0px 20px"><i style="vertical-align: middle; color:#eaeaea; margin:0px 4px 1px 4px" class="material-icons md-18">email</i>EMAIL</label>\n          <input class="auth__input--style auth__input--height" type="email" name="email" ng-model="$ctrl.user.email" autocomplete="off" />\n        </md-input-container>\n      </md-list-item>\n    </div>\n\n    <div>\n      <md-list-item class="auth__listItem--marginTop">\n        <md-input-container layout="row" layout-align="center center" class="auth__input">\n          <label style="color:  #eaeaea; font-size: 13px; font-family: \'Montserrat\', sans-serif; padding: 5px 0px 0px 20px"><i style="vertical-align: middle; color:#eaeaea; margin:0px 4px" class="material-icons md-18">lock</i>PASSWORD</label>\n          <input class="auth__input--style auth__input--height" type="password" name="password" ng-model="$ctrl.user.password" autocomplete="off" />\n        </md-input-container>\n        <p ng-if="$ctrl.button === \'Login\'" ng-click="$ctrl.onReset($event)" class="auth__forgot">?</p>\n      </md-list-item>\n    </div>\n\n    <div>\n      <md-list-item class="auth__listItem--marginTop">\n        <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height">\n          <h1 class="auth__buttonText">{{ $ctrl.button }} as a {{ $ctrl.userType }}</h1>\n        </md-button>\n      </md-list-item>\n    </div>\n\n\n  </md-list>\n</form>\n');
$templateCache.put('./login.html','<div layout="column" layout-align="center" class="auth--animation">\n    <div>\n        <auth-form user="$ctrl.user" user-type="$ctrl.userType" button="Login" on-submit="$ctrl.loginUser($event);" on-reset="$ctrl.onReset({$event: $ctrl.user.email})">\n        </auth-form>\n    </div>\n    <center>\n        <div>\n            <a ng-click="$ctrl.onRegister($event)" class="auth__trans">\n      Don\'t have an account? Create one here.\n    </a>\n        </div>\n    </center>\n</div>\n');
$templateCache.put('./register.html','<div layout="column" layout-align="center" class="auth--animation">\n    <div>\n        <auth-form user="$ctrl.user" user-type="$ctrl.userType" message="{{ $ctrl.error }}" button="Register" on-submit="$ctrl.createUser($event);">\n        </auth-form>\n    </div>\n    <center>\n        <div>\n            <a ng-click="$ctrl.onLogin($event)" class="auth__trans">Already have an account? Login here.</a>\n        </div>\n    </center>\n</div>\n');
$templateCache.put('./reset.html','<!-- <div layout="column" layout-align="center" class="auth--animation">\n  <form width="100%" name="authForm" novalidate ng-submit="$ctrl.reset($ctrl.user.email)">\n    <div width="100%" layout="column" layout-align="center center">\n      <div style="min-width:25%">\n        <md-list>\n          <md-list-item>\n            <md-input-container class="md-block" layout-fill>\n              <label>Email</label>\n              <input type="email" name="email" ng-model="$ctrl.user.email" autocomplete="off" />\n            </md-input-container>\n          </md-list-item>\n        </md-list>\n      </div>\n      <div>\n        <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button">\n          <h1 class="auth__buttonText">RESET</h1>\n        </md-button>\n      </div>\n    </div>\n  </form>\n  <center>\n    <div>\n      <a ng-click="$ctrl.onLogin($event)" class="auth__trans">Or login with an existing account.</a>\n    </div>\n  </center>\n</div> -->\n<div layout="column" layout-align="center" class="auth--animation">\n  <div>\n    <form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.submitForm();">\n      <md-list layout="column" layout-align="center center">\n\n        <div>\n          <md-list-item>\n            <md-input-container layout="row" layout-align="center center" class="auth__input">\n              <label style="color:  #eaeaea; font-size: 13px; font-family: \'Montserrat\', sans-serif; padding: 5px 0px 0px 20px"><i style="vertical-align: middle; color:#eaeaea; margin:0px 4px 1px 4px" class="material-icons md-18">email</i>EMAIL</label>\n              <input class="auth__input--style auth__input--height" type="email" name="email" ng-model="$ctrl.user.email" autocomplete="off" />\n            </md-input-container>\n          </md-list-item>\n        </div>\n\n        <div>\n          <md-list-item class="auth__listItem--marginTop">\n            <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height">\n              <h1 class="auth__buttonText">RESET {{ $ctrl.userType }} ACOUNT</h1>\n            </md-button>\n          </md-list-item>\n        </div>\n\n      </md-list>\n    </form>\n  </div>\n  <center>\n    <div>\n      <a ng-click="$ctrl.onLogin($event)" class="auth__trans">Or login with an existing account.</a>\n    </div>\n  </center>\n</div>\n');}]);
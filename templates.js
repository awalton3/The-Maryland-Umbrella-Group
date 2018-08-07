angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root">\n    <div ui-view></div>\n</div>\n');
$templateCache.put('./app.html','<div class="root">\n    <!-- <app-nav user="$ctrl.user" on-logout="$ctrl.logout();"></app-nav> -->\n    <!-- <md-sidenav flex-order="2" md-component-id="side" md-whiteframe="3" md-disable-backdrop class="md-sidenav-right md-no-pagination app__sidenav--height app__sidenav--width app__sidenav--position app__sidenav--overflow-x">\n        <div ui-view="side"></div>\n    </md-sidenav> -->\n    <div>\n        <div ui-view></div>\n    </div>\n</div>\n');
$templateCache.put('./auth.html','  <md-content class="background height--full width--full" layout="column" layout-align="center center">\n\n    <div>\n      <img src="img/mughub_logo.png" width="200px" />\n    </div>\n\n    <div class="width--full auth--animation ng-enter" style="margin-top: -30px;">\n      <md-tabs class="width--full md-no-animation" md-center-tabs="true" md-dynamic-height>\n\n        <md-tab label="STUDENT">\n          <md-content class="background auth--animation ng-enter">\n              <login ng-if="$ctrl.showLogin" on-login="$ctrl.login($event)" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset($event)" user-type="STUDENT"></login>\n              <register ng-if="$ctrl.showRegister" on-register="$ctrl.register($event)" on-login="$ctrl.toggleRegister()" user-type="STUDENT"></register>\n              <reset ng-if="$ctrl.showReset" on-reset="$ctrl.reset($ctrl.userEmail)" on-login="$ctrl.toggleLogin()" user-type="STUDENT" user-email="$ctrl.userEmail"></reset>\n          </md-content>\n        </md-tab>\n\n        <md-tab label="TUTOR">\n          <md-content class="background auth--animation ng-enter">\n              <login ng-if="$ctrl.showLogin" on-login="$ctrl.login($event)" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset($event)" user-type="TUTOR"></login>\n              <register ng-if="$ctrl.showRegister" on-register="$ctrl.register($event)" on-login="$ctrl.toggleRegister()" user-type="TUTOR"></register>\n              <reset ng-if="$ctrl.showReset" on-reset="$ctrl.reset($ctrl.userEmail)" on-login="$ctrl.toggleLogin()" user-type="TUTOR"  user-email="$ctrl.userEmail"></reset>\n          </md-content>\n        </md-tab>\n\n      </md-tabs>\n    </div>\n\n  </md-content>\n');
$templateCache.put('./memos.html','<div>\n  This is the app.\n</div>\n');
$templateCache.put('./auth-form.html','<form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.submitForm();">\n  <md-list layout="column" layout-align="center center">\n\n    <div ng-if="$ctrl.button === \'Register\'">\n      <md-list-item layout="row" layout-align="space-between center">\n\n        <div>\n          <md-input-container layout="row" layout-align="center center" class="auth">\n            <label class="auth__label auth__label--paddingName">FIRST NAME</label>\n            <input class="auth__input auth__input--height auth__input--widthHalf auth__input--borderRadiusFirstName text--center text--font" type="text" name="firstname" ng-model="$ctrl.user.firstname" autocomplete="off" />\n          </md-input-container>\n        </div>\n\n        <div>\n          <md-input-container layout="row" layout-align="center center" class="auth">\n            <label class="auth__label auth__label--paddingName">LAST NAME</label>\n            <input class="auth__input auth__input--height auth__input--widthHalf auth__input--borderRadiusLastName text--center text--font" type="text" name="lastname" ng-model="$ctrl.user.lastname" autocomplete="off" />\n          </md-input-container>\n        </div>\n\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-input-container layout="row" layout-align="center center" class="auth">\n          <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">email</i>EMAIL</label>\n          <input class="auth__input auth__input--height auth__input--width text--font" type="email" name="email" ng-model="$ctrl.user.email" autocomplete="off" />\n        </md-input-container>\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-input-container layout="row" layout-align="center center" class="auth">\n          <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">lock</i>PASSWORD</label>\n          <input class="auth__input auth__input--height auth__input--width text--font" type="password" name="password" ng-model="$ctrl.user.password" autocomplete="off" />\n        </md-input-container>\n        <p ng-if="$ctrl.button === \'Login\'" ng-click="$ctrl.reset()" class="auth__reset">?</p>\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height auth__input--width">\n          <h1 class="auth__buttonText">{{ $ctrl.button }} as a {{ $ctrl.userType }}</h1>\n        </md-button>\n      </md-list-item>\n    </div>\n\n\n  </md-list>\n</form>\n');
$templateCache.put('./login.html','<div layout="column" layout-align="center" class="auth--animation">\n  <div>\n    <auth-form user="$ctrl.user" user-type="$ctrl.userType" button="Login" on-submit="$ctrl.login($event);" on-reset="$ctrl.reset($event)">\n    </auth-form>\n  </div>\n  <center>\n    <div>\n      <a ng-click="$ctrl.onRegister($event)" class="auth__link">\n      Don\'t have an account? Create one here.\n    </a>\n    </div>\n  </center>\n</div>\n');
$templateCache.put('./register.html','<div layout="column" layout-align="center" class="auth--animation">\n    <div>\n        <auth-form user="$ctrl.user" user-type="$ctrl.userType" message="{{ $ctrl.error }}" button="Register" on-submit="$ctrl.register($event);">\n        </auth-form>\n    </div>\n    <center>\n        <div>\n            <a ng-click="$ctrl.onLogin($event)" class="auth__link">Already have an account? Login here.</a>\n        </div>\n    </center>\n</div>\n');
$templateCache.put('./reset.html','<div layout="column" layout-align="center" class="auth--animation">\n    <form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.onReset($event)">\n\n      <md-list layout="column" layout-align="center center">\n\n        <div class="auth--marginTop">\n          <md-list-item>\n            <md-input-container layout="row" layout-align="center center" class="auth">\n              <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">email</i>EMAIL</label>\n              <input class="auth__input auth__input--height auth__input--width text--font" type="email" name="email" ng-model="$ctrl.userEmail" autocomplete="off" />\n            </md-input-container>\n          </md-list-item>\n        </div>\n\n        <div class="auth--marginTop">\n          <md-list-item>\n            <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height auth__input--width">\n              <h1 class="auth__buttonText">RESET {{ $ctrl.userType }} ACOUNT</h1>\n            </md-button>\n          </md-list-item>\n        </div>\n\n      </md-list>\n    </form>\n\n  <center>\n    <div>\n      <a ng-click="$ctrl.onLogin($event)" class="auth__link">Or login with an existing account.</a>\n    </div>\n  </center>\n\n</div>\n');}]);
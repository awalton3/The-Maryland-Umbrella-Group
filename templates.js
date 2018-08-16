angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root">\n    <div ui-view></div>\n</div>\n');
$templateCache.put('./app-nav.html','<md-toolbar class="md-scroll-shrink background" flex>\n  <div class="md-toolbar-tools" layout="row" layout-align="space-between center">\n    <div>\n      <md-button ng-click="$ctrl.toggleLeft()" class="md-icon-button">\n        <img src="img/{{$ctrl.leftIcon}}.svg" />\n      </md-button>\n    </div>\n    <div>\n      <h1 class="text--weightBold text--upperCase" style="color: #2b5570">{{ $ctrl.title }}</h1>\n    </div>\n    <div>\n      <md-button ng-click="$ctrl.toggleRight()" class="md-icon-button">\n        <i style="color: #de6600" class="material-icons">{{$ctrl.rightIcon}}</i>\n      </md-button>\n    </div>\n  </div>\n</md-toolbar>\n');
$templateCache.put('./app-sidenav.html','<md-sidenav class="md-sidenav-left sideNavLeft--width height--full background--baseColor" md-component-id="left" md-whiteframe="4" flex>\n\n  <md-content class="background--baseColor">\n    <md-card class="background sideNavLeft__userCard">\n      <md-card-title layout="row" layout-align="space-around center">\n        <div>\n          <img src="img/mughub__logoicon.png" width="60px" />\n        </div>\n        <div>\n          <p style="color: #2b5570" class="text--right text--weightBold text--upperCase md-body-1">{{ $ctrl.user.attributes.firstname }} {{ $ctrl.user.attributes.lastname }}</p>\n          <p style="color: #2b5570" class="text--right text--upperCase md-caption">{{ $ctrl.user.attributes.type }}</p>\n        </div>\n      </md-card-title>\n    </md-card>\n    <div layout="column" layout-align="center center">\n      <md-list-item ng-click="$ctrl.goToUploads()" md-ink-ripple="#2b5570" class="sideNavLeft__options">\n        <p style="color: #eaeaea" class="text--center text--weightBold text--upperCase">UPLOADS</p>\n      </md-list-item>\n      <md-list-item ng-click="$ctrl.goToHourLog()" md-ink-ripple="#2b5570" class="sideNavLeft__options">\n        <p style="color: #eaeaea" class="text--center text--weightBold text--upperCase">HOUR LOG</p>\n      </md-list-item>\n      <md-list-item ng-click="$ctrl.logout()" md-ink-ripple="#2b5570" class="sideNavLeft__options" flex>\n        <p style="color: #de6600" class="text--center text--weightBold text--upperCase">LOGOUT</p>\n      </md-list-item>\n    </div>\n  </md-content>\n\n</md-sidenav>\n');
$templateCache.put('./student-app.html','<div class="root">\n    <!-- <app-nav user="$ctrl.user" on-logout="$ctrl.logout();"></app-nav> -->\n    <!-- <md-sidenav flex-order="2" md-component-id="side" md-whiteframe="3" md-disable-backdrop class="md-sidenav-right md-no-pagination app__sidenav--height app__sidenav--width app__sidenav--position app__sidenav--overflow-x">\n        <div ui-view="side"></div>\n    </md-sidenav> -->\n    <div>\n        <div ui-view></div>\n    </div>\n</div>\n');
$templateCache.put('./tutor-app.html','<div class="root">\n    <!-- <app-nav user="$ctrl.user" on-logout="$ctrl.logout();"></app-nav> -->\n    <!-- <md-sidenav flex-order="2" md-component-id="side" md-whiteframe="3" md-disable-backdrop class="md-sidenav-right md-no-pagination app__sidenav--height app__sidenav--width app__sidenav--position app__sidenav--overflow-x">\n        <div ui-view="side"></div>\n    </md-sidenav> -->\n    <div>\n        <div ui-view></div>\n    </div>\n</div>\n');
$templateCache.put('./auth.html','<md-content class="background height--full width--full" layout="column" layout-align="center center">\n\n  <div>\n    <img src="img/mughub_logo.png" width="170px" />\n  </div>\n\n  <div class="width--full auth--animation ng-enter" style="margin-top: -30px;">\n    <md-tabs class="width--full md-no-animation" md-center-tabs="true" md-dynamic-height>\n\n      <md-tab label="STUDENT">\n        <md-content class="background auth--animation ng-enter">\n          <login ng-if="$ctrl.showLogin" on-login="$ctrl.login($event)" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset($event)" user-type="STUDENT"></login>\n          <register ng-if="$ctrl.showRegister" on-register="$ctrl.register($event)" on-login="$ctrl.toggleRegister()" user-type="STUDENT"></register>\n          <reset ng-if="$ctrl.showReset" on-reset="$ctrl.reset($ctrl.userEmail)" on-login="$ctrl.toggleLogin()" user-type="STUDENT" user-email="$ctrl.userEmail"></reset>\n        </md-content>\n      </md-tab>\n\n      <md-tab label="TUTOR">\n        <md-content class="background auth--animation ng-enter">\n          <login ng-if="$ctrl.showLogin" on-login="$ctrl.login($event)" on-register="$ctrl.toggleRegister()" on-reset="$ctrl.toggleReset($event)" user-type="TUTOR"></login>\n          <register ng-if="$ctrl.showRegister" on-register="$ctrl.register($event)" on-login="$ctrl.toggleRegister()" user-type="TUTOR"></register>\n          <reset ng-if="$ctrl.showReset" on-reset="$ctrl.reset($ctrl.userEmail)" on-login="$ctrl.toggleLogin()" user-type="TUTOR" user-email="$ctrl.userEmail"></reset>\n        </md-content>\n      </md-tab>\n\n    </md-tabs>\n  </div>\n\n</md-content>\n');
$templateCache.put('./hours.html','<div layout="row" class="auth--animation" flex>\n\n  <app-sidenav></app-sidenav>\n\n  <md-content class="background" flex>\n\n    <app-nav title="hour log" left-icon="notes" right-icon="group"></app-nav>\n\n    <md-content class="background" flex>\n      <p>\n        Hours go here.\n      </p>\n    </md-content>\n\n  </md-content>\n\n  <md-sidenav class="md-sidenav-right sideNavLeft--width height--full background--baseColor" md-component-id="right" md-disable-backdrop md-is-locked-open="$mdMedia(\'gt-sm\')" md-whiteframe="3" flex>\n\n    <md-toolbar class="md-scroll-shrink background--baseColor" flex>\n      <h1 layout="row" layout-align="center center" class="md-toolbar-tools text--center text--weightBold">STUDENTS</h1>\n    </md-toolbar>\n\n    <md-content class="background--baseColor" layout-margin>\n      <p>\n        This will be the tutor\'s student contact list.\n      </p>\n    </md-content>\n\n  </md-sidenav>\n\n</div>\n');
$templateCache.put('./memos.html','<div>\n  This is the app.\n</div>\n');
$templateCache.put('./student.html','<div>\n  This is the student app.\n</div>\n');
$templateCache.put('./uploads.html','<div layout="row" layout-align="space-between start" class="auth--animation width--full">\n\n  <app-sidenav></app-sidenav>\n\n  <!-- Uploads content area -->\n  <div layout="column" layout-align="space-between center" class="uploads--height" layout-fill>\n    <md-content class="background" layout-fill>\n      <app-nav title="uploads" left-icon="notes" right-icon="group"></app-nav>\n      <md-content layout="row" layout-align="center center" class="background width--hundred">\n        <upload layout="row" layout-align="center center" class="width--hundred"></upload>\n      </md-content>\n    </md-content>\n    <div class="uploads__button">\n      <md-fab-trigger class="position--right">\n        <md-button ng-click="$ctrl.toggleUploader()" layout="row" layout-align="center center" aria-label="menu" class="md-fab background--highlightColor">\n          <i class="material-icons" style="color: #eaeaea;">create</i>\n        </md-button>\n      </md-fab-trigger>\n    </div>\n  </div>\n\n\n  <!-- Student right side-nav -->\n  <div>\n    <md-content>\n      <md-sidenav class="md-sidenav-right sideNavRight--width height--full background--baseColor" md-component-id="right" md-disable-backdrop md-is-locked-open="$mdMedia(\'gt-sm\')" md-whiteframe="3">\n        <md-toolbar class="md-scroll-shrink background--baseColor">\n          <h1 layout="row" layout-align="center center" class="md-toolbar-tools text--center text--weightBold">STUDENTS</h1>\n        </md-toolbar>\n        <md-content class="background--baseColor">\n          <div ng-repeat="student in $ctrl.students">\n            <student-card name="{{ student }}" subject="{{ $ctrl.subjects[$index] }}" initials="$ctrl.initialsArray[$index]"></student-card>\n          </div>\n        </md-content>\n      </md-sidenav>\n    </md-content>\n  </div>\n\n  <!-- Uploader/Editor -->\n  <md-sidenav class="md-sidenav-right uploader--width height--full background" md-component-id="uploader" md-disable-backdrop md-whiteframe="3">\n    <md-toolbar layout="row" layout-align="space-between center" class="md-scroll-shrink background--mainColor">\n      <div>\n        <md-button ng-click="$ctrl.toggleUploader()" class="md-button" layout="row" layout-align="center center"><i class="material-icons" style="color: #eaeaea">close</i></md-button>\n      </div>\n      <div>\n        <h1 layout="row" layout-align="center center" class="md-toolbar-tools uploader__toolbar">UPLOADER</h1>\n      </div>\n      <div>\n        <md-button ng-click="$ctrl.submitUpload($ctrl.upload); $ctrl.toggleUploader()" ng-disabled="uploadForm.$invalid" class="md-button" layout="row" layout-align="center center"><i class="material-icons" ng-class="{\'uploader__icon--active\': uploadForm.$invalid === false}">done</i></md-button>\n      </div>\n    </md-toolbar>\n    <md-content class="background" layout-padding>\n\n      <form name="uploadForm">\n\n        <p class="uploader__title">STUDENT INFORMATION</p>\n        <md-list-item layout="row" layout-align="space-between center">\n\n          <div>\n            <md-input-container layout="row" layout-align="center center" class="uploads">\n              <label class="uploads__label">first name</label>\n              <input class="uploads__input--widthHalf" type="text" name="firstname" ng-model="$ctrl.upload.firstname" autocomplete="off" required/>\n            </md-input-container>\n          </div>\n\n          <div>\n            <md-input-container layout="row" layout-align="center center" class="uploads">\n              <label class="uploads__label">last name</label>\n              <input class="uploads__input--widthHalf" type="text" name="lastname" ng-model="$ctrl.upload.lastname" autocomplete="off" required/>\n            </md-input-container>\n          </div>\n\n        </md-list-item>\n\n        <md-list-item>\n\n          <md-input-container layout="row" layout-align="center center" class="uploads">\n            <label class="uploads__label">subject</label>\n            <input class="uploads__input--width" type="text" name="subject" ng-model="$ctrl.upload.subject" autocomplete="off" required/>\n          </md-input-container>\n\n        </md-list-item>\n\n        <p class="uploader__title">ASSIGNMENT</p>\n        <md-list-item>\n\n          <md-input-container style="margin-bottom: 0px;" class="uploads">\n            <label class="uploads__label">instructions</label>\n            <textarea class="uploads__input--width" rows="2" ng-model="$ctrl.upload.instructions" md-select-on-focus required></textarea>\n          </md-input-container>\n\n        </md-list-item>\n\n        <p class="uploader__title">ADDITIONAL INFORMATION</p>\n        <md-list-item>\n\n          <md-input-container class="uploads">\n            <label class="uploads__label">comments/notes</label>\n            <textarea class="uploads__input--width" ng-model="$ctrl.upload.comments" rows="2" md-select-on-focus></textarea>\n          </md-input-container>\n\n        </md-list-item>\n\n      </form>\n\n    </md-content>\n  </md-sidenav>\n\n</div>\n');
$templateCache.put('./auth-form.html','<form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.submitForm();">\n  <md-list layout="column" layout-align="center center">\n\n    <div ng-if="$ctrl.button === \'Register\'">\n      <md-list-item layout="row" layout-align="space-between center">\n\n        <div>\n          <md-input-container layout="row" layout-align="center center" class="auth">\n            <label class="auth__label auth__label--paddingName">FIRST NAME</label>\n            <input class="auth__input auth__input--height auth__input--widthHalf auth__input--borderRadiusFirstName text--center text--font" type="text" name="firstname" ng-model="$ctrl.user.firstname" autocomplete="off" />\n          </md-input-container>\n        </div>\n\n        <div>\n          <md-input-container layout="row" layout-align="center center" class="auth">\n            <label class="auth__label auth__label--paddingName">LAST NAME</label>\n            <input class="auth__input auth__input--height auth__input--widthHalf auth__input--borderRadiusLastName text--center text--font" type="text" name="lastname" ng-model="$ctrl.user.lastname" autocomplete="off" />\n          </md-input-container>\n        </div>\n\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-input-container layout="row" layout-align="center center" class="auth">\n          <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">email</i>EMAIL</label>\n          <input class="auth__input auth__input--height auth__input--width text--font" type="email" name="email" ng-model="$ctrl.user.email" autocomplete="off" />\n        </md-input-container>\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-input-container layout="row" layout-align="center center" class="auth">\n          <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">lock</i>PASSWORD</label>\n          <input class="auth__input auth__input--height auth__input--width text--font" type="password" name="password" ng-model="$ctrl.user.password" autocomplete="off" />\n        </md-input-container>\n        <p ng-if="$ctrl.button === \'Login\'" ng-click="$ctrl.reset()" class="auth__reset">?</p>\n      </md-list-item>\n    </div>\n\n    <div class="auth--marginTop">\n      <md-list-item>\n        <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height auth__input--width">\n          <h1 class="auth__buttonText">{{ $ctrl.button }} as a {{ $ctrl.userType }}</h1>\n        </md-button>\n      </md-list-item>\n    </div>\n\n\n  </md-list>\n</form>\n');
$templateCache.put('./login.html','<div layout="column" layout-align="center" class="auth--animation">\n  <div>\n    <auth-form user="$ctrl.user" user-type="$ctrl.userType" button="Login" on-submit="$ctrl.login($event);" on-reset="$ctrl.reset($event)">\n    </auth-form>\n  </div>\n  <center>\n    <div>\n      <a ng-click="$ctrl.onRegister($event)" class="auth__link">\n      Don\'t have an account? Create one here.\n    </a>\n    </div>\n  </center>\n</div>\n');
$templateCache.put('./register.html','<div layout="column" layout-align="center" class="auth--animation">\n    <div>\n        <auth-form user="$ctrl.user" user-type="$ctrl.userType" message="{{ $ctrl.error }}" button="Register" on-submit="$ctrl.register($event);">\n        </auth-form>\n    </div>\n    <center>\n        <div>\n            <a ng-click="$ctrl.onLogin($event)" class="auth__link">Already have an account? Login here.</a>\n        </div>\n    </center>\n</div>\n');
$templateCache.put('./reset.html','<div layout="column" layout-align="center" class="auth--animation">\n    <form layout="column" layout-align="center center" name="authForm" novalidate ng-submit="$ctrl.onReset($event)">\n\n      <md-list layout="column" layout-align="center center">\n\n        <div class="auth--marginTop">\n          <md-list-item>\n            <md-input-container layout="row" layout-align="center center" class="auth">\n              <label class="auth__label auth__label--padding"><i class="material-icons md-16 auth__icon">email</i>EMAIL</label>\n              <input class="auth__input auth__input--height auth__input--width text--font" type="email" name="email" ng-model="$ctrl.userEmail" autocomplete="off" />\n            </md-input-container>\n          </md-list-item>\n        </div>\n\n        <div class="auth--marginTop">\n          <md-list-item>\n            <md-button type="submit" ng-disabled="authForm.$invalid" class="md-raised auth__button auth__input--height auth__input--width">\n              <h1 class="auth__buttonText">RESET {{ $ctrl.userType }} ACOUNT</h1>\n            </md-button>\n          </md-list-item>\n        </div>\n\n      </md-list>\n    </form>\n\n  <center>\n    <div>\n      <a ng-click="$ctrl.onLogin($event)" class="auth__link">Or login with an existing account.</a>\n    </div>\n  </center>\n\n</div>\n');
$templateCache.put('./student-card.html','<md-card class="background sideNavRight__studentCard">\n  <md-card-title layout="row" class="studentCard__content" flex>\n    <div layout="row" layout-align="center center" style="background: #FF7241" class="sideNavRight__studentCard__initials" flex="35">\n      <p class="sideNavRight__studentCard__initialsText">{{ $ctrl.initials }}</p>\n    </div>\n    <div layout="column" layout-align="center start" class="studentCard__contentText" flex="65">\n      <p style="color: #2b5570" class="text--left text--weightBold text--upperCase md-body-1">{{ $ctrl.name }}</p>\n      <p style="color: #2b5570" class="text--left text--upperCase md-caption">{{ $ctrl.subject }}</p>\n    </div>\n  </md-card-title>\n</md-card>\n');
$templateCache.put('./upload.html','<md-card class="uploads__card background">\n  <md-card-title class="uploads__cardTitle">\n    <md-card-title-media>\n      <img src="img/face.svg" class="uploads__cardImage"/>\n    </md-card-title-media>\n    <!-- <div layout="row" layout-align="center center" style="background: #FF7241" class="sideNavRight__studentCard__initials">\n      <p class="sideNavRight__studentCard__initialsText">J.T</p>\n    </div> -->\n    <md-card-title-text>\n      <span class="uploads__cardName">JANE DOE</span>\n      <span class="uploads__cardSubject">AP U.S. HISTORY</span>\n      <span class="uploads__cardDate"><i>Created January 21st</i></span>\n    </md-card-title-text>\n  </md-card-title>\n  <md-card-actions layout="row" layout-align="end center">\n    <md-button>EDIT</md-button>\n    <md-button>DELETE</md-button>\n  </md-card-actions>\n</md-card>\n');}]);
class UserModel {
    constructor(Parse) {
        this.Parse = Parse;
        this.data = {};
        this.name = 'User';
        this.fields = [
            'lastName',
            'emailVerified',
            'data',
            'type',
            'authData',
            'username',
            'firstname',
            'password',
            'email'
        ];
    }
    New(obj) {
        if (angular.isUndefined(obj)) {
            let parseObject = new this.Parse.Object(this.name)
            this.Parse.defineAttributes(parseObject, this.fields);
            return parseObject;
        } else {
            this.Parse.defineAttributes(obj, this.fields);
            return obj;
        }
    }
    getById(id) {
        return new this.Parse.Query(this.New()).get(id)
            .then(result => {
                this.Parse.defineAttributes(result, this.fields);
                this.data = result;
                return Promise.resolve(result);
            }).catch(error => Promise.reject(error));
    }
    // getByEmail(email) {
    //     return new this.Parse.Query(this.New()).get(email)
    //         .then(result => {
    //             this.Parse.defineAttributes(result, this.fields);
    //             this.data = result;
    //             return Promise.resolve(result);
    //         }).catch(error => Promise.reject(error));
    // }
}

angular
    .module('common')
    .service('UserModel', UserModel);

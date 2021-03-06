class TutorModel {
  constructor($q, Parse) {
    this.$q = $q;
    this.Parse = Parse;
    this.data = {};
    this.name = 'Tutor';
    this.fields = [
      'user',
      'students',
      'subjects'
    ];
  }

  New(obj) {
    if (angular.isUndefined(obj)) {
      let parseObject = new this.Parse.Object(this.name)
      this.Parse.defineAttributes(parseObject, this.fields);
      return parseObject
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

  getByUser(user) {
    return this.$q((resolve, reject) => {
      new this.Parse.Query(this.New())
        .equalTo('user', user)
        .find()
        .then((results) => {
          resolve(results);
        }, (error) => {
          this.ParseError.Catch(error);
          reject(error);
        });
    });
  }
}

angular
  .module('common')
  .service('TutorModel', TutorModel);

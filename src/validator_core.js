window.sillypog = window.sillypog || {};
window.sillypog.validator = window.sillypog.validator || {};
window.sillypog.validator.Core = (function(){
	'use strict';

	function Validator(){
		this.validations = [];
		this.errors = [];
		this.dateRegEx = new RegExp(/\d{4}-\d{2}-\d{2}/);
	}

	Validator.prototype.addValidations = function addValidations(validations){
		this.validations = this.validations.concat(validations);
	};

	Validator.prototype.validate = function validate(data){
		this.data = data;
		this.errors = [];

		for(var i=0, l=this.validations.length; i < l; i++){
			this.validations[i].call(this);
		}
		return this.errors;
	};

	Validator.prototype.dataField = function dataField(fieldName){
		return this.data[this.formName+'['+fieldName+']'];
	};

	Validator.prototype.arrayFields = function arrayFields(fieldName){
		var fieldRegEx = new RegExp(this.formName+'\\['+fieldName+'_attributes\\]\\[(\\d)\\]\\[(.*)\\]'),
		    fields = []; // Build an array of objects and return it
		// Loop over all the properties of data
		for (var prop in this.data){
			var hit = prop.match(fieldRegEx);
			// Pull out ones that match our regex
			if (hit){
				var index = parseInt(hit[1], 10),
				    key = hit[2],
				    obj = fields[index] ? fields[index] : fields[index] = {_index: index};
				obj[key] = this.data[prop];
			}
		}
		return fields;
	};

	Validator.prototype.reportError = function reportError(fieldName){
		var error = this.formName + '_' + fieldName;
		if (this.errors.indexOf(error) < 0){
			this.errors.push(error);
		}
	};

	return Validator;
})();

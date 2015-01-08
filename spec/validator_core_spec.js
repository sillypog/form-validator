/* globals describe, it, expect, beforeEach */

describe('validator.Core.js test suite', function() {
	var concreteValidator;

	beforeEach(function(){
		function ConcreteValidator(){
			window.sillypog.validator.Core.call(this);

			this.addValidations([
				this.firstValidation,
				this.secondValidation
			]);

			this.formName = 'concrete';
		}

		ConcreteValidator.prototype = Object.create(window.sillypog.validator.Core.prototype);

		ConcreteValidator.prototype.firstValidation = function firstValidation(){
			if (!this.dataField('description')){
				this.reportError('description');
			}
		};

		ConcreteValidator.prototype.secondValidation = function secondValidation(){
			if (this.dataField('description') !== 'hello'){
				this.reportError('description');
			}
		};

		concreteValidator = new ConcreteValidator();
	});

	describe('dateRegEx', function(){
		it('should recognise "2014-12-11"', function(){
			expect(concreteValidator.dateRegEx).toBeDefined();
			expect('2014-12-11').toMatch(concreteValidator.dateRegEx);
			expect('12-11-2014').not.toMatch(concreteValidator.dateRegEx);
		});
	});

	describe('addValidations', function(){
		it('should have both validations', function(){
			expect(concreteValidator.validations.length).toEqual(2);
		});
	});

	describe('reportError', function(){
		it('should reportErrors', function(){
			concreteValidator.reportError('field1');

			expect(concreteValidator.errors.length).toEqual(1);
		});

		it('should record multiple errors', function(){
			concreteValidator.reportError('field1');
			concreteValidator.reportError('field2');

			expect(concreteValidator.errors.length).toEqual(2);
		});

		it('should record each error once', function(){
			concreteValidator.reportError('field1');
			concreteValidator.reportError('field1');

			expect(concreteValidator.errors.length).toEqual(1);
		});
	});

	describe('data operations', function(){
		var goodData, badData;

		beforeEach(function(){
			goodData = {
				'concrete[id]': 1,
				'concrete[description]': 'hello'
			};

			badData = {
				'concrete[id]': 1,
				'concrete[description]': 'bye'
			};
		});

		describe('dataField', function(){
			it('should read from correct field', function(){
				concreteValidator.data = goodData;

				expect(concreteValidator.dataField('description')).toEqual('hello');
				expect(concreteValidator.dataField('id')).toEqual(1);
			});
		});

		describe('validate', function(){
			it('should approve good data', function(){
				var errors = concreteValidator.validate(goodData);
				expect(errors.length).toEqual(0);
			});

			it('should give errors for bad data', function(){
				var errors = concreteValidator.validate(badData);
				expect(errors.length).toEqual(1);
			});
		});
	});

	describe('array operations', function(){
		beforeEach(function(){
			var data = {
				'normal_field': 'true',
				'concrete[elements_attributes][0][_destroy]': 'false',
				'concrete[elements_attributes][0][description]': 'first',
				'concrete[elements_attributes][0][id]': '1',
				'concrete[elements_attributes][1][_destroy]': 'false',
				'concrete[elements_attributes][1][description]': 'second',
				'concrete[elements_attributes][1][id]': '2'
			};

			concreteValidator.data = data;
		});

		describe('arrayFields', function(){
			it('should retrieve all array elements', function(){
				var elements = concreteValidator.arrayFields('elements');

				expect(elements.length).toEqual(2);
				expect(elements[0]).toEqual({
					_destroy: 'false',
					description: 'first',
					id: '1'
				});
				expect(elements[1]).toEqual({
					_destroy: 'false',
					description: 'second',
					id: '2'
				});
			});
		});
	});
});

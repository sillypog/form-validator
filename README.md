# form-validator
Modular javascript form validator

# Install
`bower install form-validator`

Add `src/validator_core.js` through a script tag. The code is attached to the window object as `sillypog.validator.Core`.

# Usage
`validator.Core` provides a framework for custom form validators to build on. It should be extended to create custom validators for your own forms. It expects data to be serialized in the format provided by [jQuery.serializeObject](https://github.com/hongymagic/jQuery.serializeObject).

Here is an example validator to process a form containing:
* Description text that must be present.
* A start date that must correctly formatted.
* A series of entries fields, at least one of which must be completed.

```Javascript
function NewValidator(){
	sillypog.validator.Core.call(this);

	this.addValidations([
		this.hasDescription,
		this.hasValidStartDate,
		this.allEntriesCompleted
	]);

	this.formName = 'promo';
}

NewValidator.prototype = Object.create(sillypog.validator.Core.prototype);

NewValidator.prototype.hasDescription = function hasDescription(){
	if (!this.dataField('description')){
		this.reportError('description');
	}
};

NewValidator.prototype.hasValidStartDate = function hasValidStartDate(){
	if (!this.dateRegEx.test(this.dataField('start_date'))){
		this.reportError('start_date');
	}
};

NewValidator.prototype.allEntriesCompleted = function allEntriesCompleted(){
	var entries = this.arrayFields('entries');

	for (var i=0, l=entries.length; i<l; i++){
		if(!this.entries[i]){
			this.reportError('entries_attributes_'+i+'_description');
		}
	}
};
```

The constructor calls to the Core superclass to initialize internal members. It also sets the validation methods to call via `addValidations`. These will be called in the order specified. The validation methods should be instance methods of the custom validator, as they will access the data through `this`. Finally, the constructor sets the formName to promo: this will allow data values to be read from fields with ids prefaced with "promo_".

The `hasDescription` validation method checks the value of the form field with the id "promo_description". Because the formName has been set, the preface is not required so the value is read with the call `this.dataField('description')`. If the field is empty, the invalid field is logged by `this.reportError('description')`.

The `hasValidStartDate` works similarly, reading the value of "promo_start_date". This time the presence of a value is not enough, it must meet the format specified by `this.dateRegEx`, a value initialized in the `validator.Core` constructor. This matches dates in the format YYYY-MM-DD.

The `hasAtLeastOneEntry` processes fields that have been serialized as an array. They will have ids of "promo_entries_attributes_0_description", "promo_entries_attributes_1_description", etc. These fields are read into the `entries` array by `this.arrayFields('entries')`. If an entry does not have text in its description field, we record that invalid field through `this.reportError`, as always omitting the "promos_" prefix.

# Using custom validators
The custom validator shown above could be used as follows:

```Javascript
function handleSubmitClick(event){
	var button = $(event.currentTarget),
	    form = button.closest('form'),
	    validator = new NewValidator(),
	    errors = validator.validate(form.serializeObject());

	// Add new errors or submit
	if (!errors.length){
		submitForm(form);
	} else {
		displayErrors(form, errors);
	}
}

function displayErrors(form, errors){
	for (var i=0, l=errors.length; i < l; i++){
		form.find('#'+errors[i]).addClass('field-error');
	}
}
```

In response to clicking the submit button, the form is serialized and passed to the NewValidator instance's `validate` method. That will return the array of fields containing errors, as reported through `reportError`. If errors are found, they are displayed to the user by looping through the errors array and adding the "field-error" class to each invalid field.

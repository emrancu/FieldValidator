
/*Author :AL EMRAN
email:emrancu1@gmail.com
website:http://alemran.me
*/


const fieldValidator = {

    selectedForm: '',
    checkRequired: function () {
        let self = this;
        let status = true;
        $(this.selectedForm).find('input[required]').each(function () {
            let fieldValue = $(this).val();
            // check if value is null
            if (!fieldValue) {
                $(this).addClass('is-invalid');
                // add onkeyup event to field for live checking
                self.createLiveEvent(this)
                status = false;

            } else {
                let CheckableValue = $(this).attr('data-validate');
                // check if value checker is enabled
                if (CheckableValue) {
                    let check = self.validateFieldData({rules: CheckableValue, val: fieldValue});
                    if (!check) {
                        $(this).addClass('is-invalid');
                        // add onkeyup event to field for live checking
                        self.createLiveEvent(this)
                        status = false;
                    } else {
                        $(this).addClass('is-valid');
                    }
                } else {
                    $(this).addClass('is-valid');
                }
            }
        })
        return status;
    },
    validateFieldData: function (option) {
        let status = true;
        let self = this;

        let valueAsArray = option.rules.split('|');

        valueAsArray.forEach(function (data) {

            let validateOption = {
                data: option.val,
            }

            let split = data.split(':');

            validateOption.checker = split[0];
            if (split.length > 1) validateOption.limit = split[1];

            let check = self.dataValidate(validateOption);

            if (!check) {
                status = false
            }


        });

        return status;
    },
    dataValidate: function (option) {
        let valueStatus = false;

        switch (option.checker) {
            case 'mobile':
                if (/^[0]/.test(option.data) && /^[0-9]*$/.test(option.data)) valueStatus = true;
                break;
            case 'number':
                if (/^[0-9]*$/.test(option.data)) valueStatus = true;
                break;

            case 'floatNumber':
                if (/\-?\d+\.\d+/.test(option.data)) valueStatus = true;
                break;
            case 'noNumber':
                if (/^([^0-9]*)$/.test(option.data)) valueStatus = true;
                break;
            case 'letter':
                if (/^([A-Za-z ]*)$/.test(option.data)) valueStatus = true;
                break;
            case 'noSpecialChar':
                (/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/.test(option.data) ? valueStatus = false : valueStatus = true)
                break;
            case 'limit':
                if (eval('/^.{' + option.limit + '}$/').test(option.data)) valueStatus = true;
                break;
            case 'email':
                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(option.data)) valueStatus = true;
                break;


        }
        return valueStatus;
    },
    createLiveEvent: function (field) {

        let self = this;

        $(field).keyup(function (e) {

            let fielsValue = $(this).val();
            if (fielsValue) {

                let validator = $(this).attr('data-validate');
                if (validator) {
                    let check = self.validateFieldData({rules: validator, val: this.value});
                    if (!check) {
                        $(this).removeClass('is-valid').addClass('is-invalid')

                    } else {

                        $(this).removeClass('is-invalid').addClass('is-valid');
                    }
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                }

            } else {
                $(this).removeClass('is-valid').addClass('is-invalid');
            }

        })
    },
    check: function (form) {
        this.selectedForm = form;
        return this.checkRequired();
    }

}


$(needsValidation).submit(function (e) {
    e.preventDefault();
    console.log(fieldValidator.check(needsValidation));
})

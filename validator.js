/*Author :AL EMRAN
email:emrancu1@gmail.com
website:http://alemran.me
project: https://github.com/emrancu/FieldValidator
*/


const fieldValidator = {
    selectedForm: '',
    checkRequired: function () {
        let self = this;
        let status = true;
        $(this.selectedForm).find('input[required],input[data-validate]').each(function () {
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
                if (typeof CheckableValue !== typeof undefined && CheckableValue !== false) {

                    let check = self.wayToValidator({rules: CheckableValue, val: fieldValue});
                    if (!check) {
                        $(this).addClass('is-invalid');
                        if (!self.valueChecker) { // check  it value live checker already enabled or not
                            // add onkeyup event to field for live checking
                            self.createLiveEvent(this)
                        }
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
    wayToValidator: function (option) {
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
                if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(option.data)) valueStatus = true;
                break;

        }
        return valueStatus;
    },
    createLiveEvent: function (field) {
        let self = this;
        $(field).keyup(function (e) {
            let isRequired = $(this).attr('required');
            let isValidator = $(this).attr('data-validate');
            let fielsValue = $(this).val();

            if (typeof isRequired !== typeof undefined && isRequired !== false) {

                if (fielsValue) {

                    if (typeof isValidator !== typeof undefined && isValidator !== false) {
                        self.valueCheckForLiveEvent(this, isValidator, fielsValue)
                    } else {
                        $(this).removeClass('is-valid').addClass('is-invalid');
                    }

                } else {
                    $(this).removeClass('is-valid').addClass('is-invalid');
                }
            } else {

                if (fielsValue) {
                    if (typeof isValidator !== typeof undefined && isValidator !== false) {
                        self.valueCheckForLiveEvent(this, isValidator, fielsValue);

                    }

                } else {
                    $(this).removeClass('is-invalid'); //.addClass('is-valid');
                }
            }


        })
    },
    valueCheckForLiveEvent: function (field, validator, val) {

        let check = this.wayToValidator({rules: validator, val: val});
        if (!check) {

            $(field).removeClass('is-valid').addClass('is-invalid')

        } else {

            $(field).removeClass('is-invalid').addClass('is-valid');
        }
    },
    valueChecker: false,
    initValueChecker: function (form) {
        this.selectedForm = form;
        this.valueChecker = true;
        let self = this;
        $(this.selectedForm).find('input[data-validate]').each(function (e) {
            self.createLiveEvent(this);
        })

    },
    check: function (form) {
        this.selectedForm = form;
        return this.checkRequired();
    }

}


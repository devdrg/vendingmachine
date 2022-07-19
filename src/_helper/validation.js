const checkValidation = (value, rules) => {
    //   required
    if (rules.matchString) {
        const rule = value.trim() === rules.matchString;
        if (!rule) {
            return "Parola nu corespunde.";
        }
    }
    //   required
    if (rules.required) {
        const rule = value.trim() !== "";
        if (!rule) {
            return "Câmp obligatoriu.";
        }
    }
    // min length
    if (rules.minLength) {
        const rule = value.length >= rules.minLength;
        if (!rule) {
            return `Minim ${rules.minLength} caractere.`;
        }
    }
    // max length
    if (rules.maxLength) {
        const rule = value.length <= rules.maxLength;
        if (!rule) {
            return `Maxim ${rules.maxLength} caractere.`;
        }
    }
    // is string
    if (rules.string) {
        const rule = /^([a-zA-Z ]*)$/.test(value);
        if (!rule) {
            return "Valoarea introdusă conține caractere sau simboluri neacceptate.";
        }
    }
    // no spaces
    if (rules.spaces) {
        const rule = /^([^ ]*)$/.test(value);
        if (!rule) {
            return "Spațiile nu sunt permise.";
        }
    }
    // is number
    if (rules.number) {
        const rule = /^(\d*)$/.test(value);
        if (!rule) {
            return "Valoarea introdusă trebuie să fie un număr.";
        }
    }
    return "";
};

export default checkValidation;

module.exports = {
    "extends": "airbnb",
    "plugins": [],
    "rules" : {
        "max-len" : ["error", 150],
        "func-names" : ["off"],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never",
        }],
    }
};

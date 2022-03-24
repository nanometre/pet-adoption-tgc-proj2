const { object, string, number, array } = require("yup");

// Validation schema for editing existing animal entry
const putAnimalSchema = object({
    body: object({
        name: string()
              .required("name is required")
              .typeError("name must be a string"),
        img_url: string()
                 .required("image url is required")
                 .url("image must be a valid url"),
        gender: string()
                .required("gender is required")
                .matches(/^(?:Male|Female)$/, 
                         "gender must be Male or Female"),
        date_of_birth: string()
                       .required("date_of_birth is required")
                       .matches(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/,
                       "date_of_birth is not valid ISO datetime"
          ),
        species: object({
            species_name: string()
                          .required("species_name is required")
                          .typeError("species_name must be a string"),
            breed: string()
                   .required("breed is required")
                   .typeError("breed must be a string")
        }),
        description: string()
                     .required("description is required")
                     .typeError("description must be a string"),
        status_tags: array().of(
            string().typeError("status_tags must be a string")
        ),
        adopt_foster: array().of(
            string()
            .required("adopt_foster is required")
            .typeError("adopt_foster must be a string")
        ),
        current_caretaker: object({
            _id: number()
                 .required("current_caretaker _id is required")
                 .typeError("current_caretaker _id must be a string"),
            caretaker_name: string()
                            .required("caretaker_name is required")
                            .typeError("caretaker_name must be a string"),
            email: string()
                   .email("current_caretaker email is not valid")
                   .required("current_caretaker email is required")
        })
    }),
    params: object({
        _id: string().required("_id is required").typeError("_id must be string")
    })
})

// Validation schema for creating new animal entry
const postAnimalSchema = object({
    body: object({
        name: string()
              .required("name is required")
              .typeError("name must be a string"),
        img_url: string()
                 .required("image url is required")
                 .url("image must be a valid url"),
        gender: string()
                .required("gender is required")
                .matches(/^(?:Male|Female)$/, 
                         "gender must be Male or Female"),
        date_of_birth: string()
                       .required("date_of_birth is required")
                       .matches(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/,
                       "date_of_birth is not valid ISO datetime"
          ),
        species: object({
            species_name: string()
                          .required("species_name is required")
                          .typeError("species_name must be a string"),
            breed: string()
                   .required("breed is required")
                   .typeError("breed must be a string")
        }),
        description: string()
                     .required("description is required")
                     .typeError("description must be a string"),
        status_tags: array().of(
            string().typeError("status_tags must be a string")
        ),
        adopt_foster: array().of(
            string()
            .required("adopt_foster is required")
            .typeError("adopt_foster must be a string")
        ),
        current_caretaker: object({
            _id: string()
                 .typeError("current_caretaker _id must be a string"),
            caretaker_name: string()
                            .required("caretaker_name is required")
                            .typeError("caretaker_name must be a string"),
            email: string()
                   .email("current_caretaker email is not valid")
                   .required("current_caretaker email is required")
        })
    })
})

// Validation schema animal ID only
const animalIdSchema = object({
    params: object({
        _id: string().required("_id is required").typeError("_id must be string")
    })
})


module.exports = {
    putAnimalSchema,
    postAnimalSchema,
    animalIdSchema
}
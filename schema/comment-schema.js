const { object, string, number } = require("yup");

// Validation schema for creating new comment entry
const postCommentSchema = object({
    body: object({
        animal_id: string()
                   .required("animal_id is required")
                   .typeError("animal_id must be a string"),
        commenter_name: string()
                        .required("commenter_name is required")
                        .typeError("commenter_name must be a string"),
        comment: string()
                 .required("comment is required")
                 .typeError("comment must be a string"),
        rating: number()
                .required("rating is required")
                .min(1, "rating must be 1 or more")
                .max(5, "rating must be 5 or less")
    })
})

module.exports = {
    postCommentSchema
}
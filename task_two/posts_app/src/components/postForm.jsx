import { useState } from "react";

function PostForm({
  initialValues = { title: "", body: "" },
  submitLabel = "Save",
  loading = false,
  error = "",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function validate(current) {
    const found = {};
    if (!current.title.trim()) {
      found.title = "Title is required.";
    } else if (current.title.trim().length < 3) {
      found.title = "Title must be at least 3 characters.";
    }
    if (!current.body.trim()) {
      found.body = "Body is required.";
    } else if (current.body.trim().length < 10) {
      found.body = "Body must be at least 10 characters.";
    }
    return found;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Once a field has an error, re-check it as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: validate(next)[name] });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ title: values.title.trim(), body: values.body.trim() });
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          className={errors.title ? "invalid" : ""}
          aria-invalid={Boolean(errors.title)}
        />
        <small className="form-error">{errors.title}</small>
      </div>

      <div className="form-field">
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          name="body"
          rows="6"
          value={values.body}
          onChange={handleChange}
          className={errors.body ? "invalid" : ""}
          aria-invalid={Boolean(errors.body)}
        />
        <small className="form-error">{errors.body}</small>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
export interface TourForm {
  name: string;
  description: string;
  date: string;
  duration: number;
}

export interface TourErrors {
  name: string;
  description: string;
  date: string;
  duration: string;
}

export function validateTourForm(form: TourForm, errors: TourErrors): boolean {
  let valid = true;

  if (!form.name) {
    errors.name = 'Name is required.';
    valid = false;
  } else if (form.description.length > 50) {
    errors.description = 'Name cannot exceed 50 characters.';
    valid = false;
  } else {
    errors.name = '';
  }

  // Description
  if (!form.description) {
    errors.description = 'Description is required.';
    valid = false;
  } else if (form.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
    valid = false;
  } else {
    errors.description = '';
  }

  // Date
  const today = new Date();
  const selectedDate = new Date(form.date);
  if (!form.date) {
    errors.date = 'Date is required.';
    valid = false;
  } else if (selectedDate < today) {
    errors.date = 'Date cannot be in the past.';
    valid = false;
  } else {
    errors.date = '';
  }

  // Duration
  if (form.duration == null) {
    errors.duration = 'Duration is required.';
    valid = false;
  } else if (form.duration < 1 || form.duration > 168) {
    errors.duration = 'Duration must be between 1 and 168 hours.';
    valid = false;
  } else {
    errors.duration = '';
  }

  return valid;
}

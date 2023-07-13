const dateRanges = [
  { start: new Date(2023, 6, 13, 7, 0), end: new Date(2023, 6, 13, 12, 0) },
  { start: new Date(2023, 6, 13, 13, 0), end: new Date(2023, 6, 13, 16, 0) }, // overlapping
];

// yup validation schema for checking if date range overlap
const dateRangeSchema = yup.object().shape({
  start: yup.date().required(),
  end: yup.date().required(),
  // .when('start', (start, schema) =>
  //   start && start[0] ? schema.min(start[0], 'End date must be after start date') : schema
  // ),
});

const dateRangesSchema = yup
  .array()
  .of(dateRangeSchema)
  .test({
    name: 'are-date-ranges-not-overlapping',
    message: 'Date ranges must not overlap',
    test: (dateRanges) => {
      if (!dateRanges) return true;
      if (dateRanges.length === 0) return true;

      for (let i = 0; i < dateRanges.length; i++) {
        const a = dateRanges[i];

        for (let k = 0; k < dateRanges.length; k++) {
          const b = dateRanges[k];

          // skip if same date range
          if (i === k) continue;

          // check if date ranges overlap
          // touching is possible
          if (a.start < b.end && a.end > b.start) {
            return false;
          }
        }
      }

      return true;
    },
  });

dateRangesSchema.validateSync(dateRanges);

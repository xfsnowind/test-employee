import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { z } from "zod";
// Note: @tanstack/form API surface may vary; this keeps an example contract only

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export default function App() {
  const [values, setValues] = React.useState({ name: "", email: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const err: Record<string, string> = {};
      for (const issue of result.error.issues) {
        err[issue.path[0] as string] = issue.message;
      }
      setErrors(err);
      return;
    }
    setErrors({});
    // submit
    alert(`Submitted: ${JSON.stringify(values)}`);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Form
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
            error={!!errors.email}
            helperText={errors.email}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

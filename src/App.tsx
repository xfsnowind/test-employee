import { Container, Box } from '@mui/material';
import EmployeeList from './features/employee-list/EmployeeList';

export default function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <EmployeeList />
      </Box>
    </Container>
  );
}

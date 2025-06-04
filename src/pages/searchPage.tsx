import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography
} from '@mui/material';

import { useUserStore } from '../store/userStore';
import { useUserRepoStore } from '../store/userRepo';
import utility from '../tools/utility';
import AccordionComponent from '../components/UserAccordion';
import { searchUsers } from '../services/githubService';

const SearcPages: React.FC = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { users, setUsers, clearUsers } = useUserStore();
  const { userRepo,clearUserRepo } = useUserRepoStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // clearUserRepo()
  }, [users,userRepo]);

  const handleSearch = async () => {
    clearUsers()
    clearUserRepo()
    if (!username.trim()) {
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    setErrorMsg(null);

    try {
      const response = await searchUsers(username, 5, 5);
      if (utility.responseCode(response.status)) {
        if (response.data.total_count > 1) {
          setResult(`Showing users of: "${username}"`);
          const newData = response.data.items.map((item: any) => ({
            login: item.login,
            id: item.id
          }));

          setUsers(newData);
        } else {
          setErrorMsg('No data found!');
          clearUsers();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await clearUserRepo()
      await clearUsers()
      if (!username.trim()) {
        setError(true);
        return;
      }
      setError(false);
      handleSearch();
    }
  };

  const handleChange = (val: string) => {
    setUsername(val);
    setError(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        color: 'black',
        p: 3,
        borderRadius: 2,
        textAlign: 'center',
        maxWidth: 800,
        width: '100%',
        mx: 'auto',
        mt: 6
      }}
    >
      <TextField
        fullWidth
        placeholder="Enter username"
        value={username}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        error={error}
        helperText={error ? 'Field cannot be empty' : ''}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSearch}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>

      {result && (
        <Typography variant="body1" color="primary" mt={3}>
          {result}
        </Typography>
      )}

      <Box mt={3}>
        {users.length > 0 ? (
          <AccordionComponent />
        ) : (
          errorMsg && <Typography color="error">{errorMsg}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearcPages;

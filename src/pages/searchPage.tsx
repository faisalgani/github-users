import React, { useState,useEffect } from 'react';
import { Box, TextField, Button, Typography,Grid } from '@mui/material';
import { useUserStore } from '../store/userStore';
import utility from '../tools/utility'
import AccordionComponent from '../components/UserAccordion';
import { searchUsers } from '../services/githubService';


const SearcPages: React.FC = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { users, setUsers, clearUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    // console.log('Users changed:', users);
  }, [users]);

  const handleSearch = async() => {
    if (!username.trim()) {
      return;
    }
    try {
        // const response = await axios.get(`https://api.github.com/search/users?q=${username}&since=5&per_page=5`);
        const response = await searchUsers(username,5,5)
        console.log(response)
        if (utility.responseCode(response.status)) {
          if(response.data.total_count > 1){
            setResult(`Showing users of: "${username}"`);
             const newData = response.data.items.map((item: any) => {
              return {
                login :  item.login,
                id :  item.id,
              };
            });
            await setUsers(newData);
          }else{
            setError('no data found !')
            await clearUsers()
          }
        }
    } catch (err: any) {
        setError(err.message || 'Something went wrong.');
    } finally {
        setLoading(false);
    }
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
        mt: 6,
      }}
    >
      <Box>
        <TextField
          fullWidth
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
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
      </Box>

      {result && (
        <Typography variant="body1" color="primary" mt={3}>
          {result}
        </Typography>
      )}

      <Box mt={3}>
        {users.length > 0 ? (
          <AccordionComponent />
        ) : (
          error && <Typography color="error">{error}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearcPages;
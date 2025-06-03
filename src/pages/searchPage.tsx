import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';
import utility from '../tools/utility'
import AccordionComponent from '../components/UserAccordion';


const SearcPages: React.FC = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { users, setUsers, clearUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // console.log('Users changed:', users);
  }, [users]);

  const handleSearch = async() => {
    if (!username.trim()) {
      return;
    }
    setResult(`Showing users of: "${username}"`);
    // clearUsers()
    try {
        const response = await axios.get(`https://api.github.com/search/users?q=${username}&since=5&per_page=5`);
        if (utility.responseCode(response.status)) {
          if(response.data.total_count > 1){
            await setUsers(response.data.items);
          }
        }
    } catch (err: any) {
        setError(err.message || 'Something went wrong.');
    } finally {
        setLoading(false);
    }
  //  console.log('Users in store:', users);
  };

  return (
    <div>
     <Box 
      sx={{
          backgroundColor: '#ffffff',
          color: 'black',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: '100%',      
          width: '100%',    
          margin: 'auto',
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        component="section">
          <TextField id="outlined-basic"
            placeholder='Enter username' 
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined" />

            <Button variant="contained" onClick={handleSearch} fullWidth>Search</Button>
            {result && (
            <Typography variant="body1" color="primary">
              {result}
            </Typography>
          )}

           {users.length > 1 ? (
            <AccordionComponent/>
          ) : (
            ''
          )}
      </Box>

    </div>
  );
};

export default SearcPages;
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUserStore } from '../store/userStore';
import { useUserRepoStore } from '../store/userRepo';
import utility from '../tools/utility'
import StarIcon from '@mui/icons-material/Star';
import { getUserRepos } from '../services/githubService';


const UserAccordion: React.FC = () => {
  const { users } = useUserStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { userRepo, setUserRepo, clearUserRepo } = useUserRepoStore();

  const handleChange =
    (index: number, username : string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedIndex(isExpanded ? index : null);
      getDetailRepo(username)
    };

  const getDetailRepo = async(username:string) => {
     try {
          const response = await getUserRepos(username)
          if (utility.responseCode(response.status)) {
             const newData = response.data.map((item: any) => {
              return {
                name :  item.name,
                description :  item.description,
                stargazers_count: item.stargazers_count
              };
            });
            await setUserRepo(newData);
          }
    } catch (err: any) {
    } finally {
    }
  }

  useEffect(() => {

  }, [userRepo]);
  return (
   <div style={{ width: '100%', margin: '2rem auto' }}>
      {users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        users.map((user, index) => (
          <Accordion sx={{backgroundColor: '#fffffff'}}
            key={user.id}
            expanded={expandedIndex === index}
            onChange={handleChange(index,user.login)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{user.login}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ ml: 2,boxShadow: 'none'  }}>
               {userRepo.length > 0 ? (
                   userRepo.map((repo, i) => (
                  <Box sx={{ flexGrow: 5, backgroundColor: '#f5f5f5', padding: 2, mb: i !== userRepo.length - 1 ? 2 : 0, }}>
                  <Grid spacing={2} container sx={{ outline: 'none' }}>
                    <Grid size={8} sx={{ textAlign: 'left' }} >
                      <Typography sx={{ fontWeight: 'bold' }} >{repo.name}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end',fontWeight: 'bold' }}
                      >
                        <StarIcon sx={{ color: 'black', mr: 0.5 }} />
                        {repo.stargazers_count}
                      </Typography>
                    </Grid>
                    <Grid size={12} sx={{ textAlign: 'left' }}>
                      <Typography>{repo.description}</Typography>
                    </Grid>
                    
                  </Grid>
                </Box>
                )) 
  
                ) : (
                 <Typography>No repo found !</Typography>
                )} 
              { userRepo.map((repo, i) => (
                  <Box sx={{ flexGrow: 5, backgroundColor: '#f5f5f5', padding: 2, mb: i !== userRepo.length - 1 ? 2 : 0, }}>
                  <Grid spacing={2} container sx={{ outline: 'none' }}>
                    <Grid size={8} sx={{ textAlign: 'left' }} >
                      <Typography sx={{ fontWeight: 'bold' }} >{repo.name}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end',fontWeight: 'bold' }}
                      >
                        <StarIcon sx={{ color: 'black', mr: 0.5 }} />
                        {repo.stargazers_count}
                      </Typography>
                    </Grid>
                    <Grid size={12} sx={{ textAlign: 'left' }}>
                      <Typography>{repo.description}</Typography>
                    </Grid>
                    
                  </Grid>
                </Box>
                )) 
              }
              
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default UserAccordion;

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';

import { useUserStore } from '../store/userStore';
import { useUserRepoStore } from '../store/userRepo';
import utility from '../tools/utility';
import { getUserRepos } from '../services/githubService';

const UserAccordion: React.FC = () => {
  const { users } = useUserStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { userRepo, setUserRepo } = useUserRepoStore();

  const handleChange = (index: number, username: string) => async (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedIndex(isExpanded ? index : null);

    if (isExpanded) {
      try {
        const response = await getUserRepos(username);
        if (utility.responseCode(response.status)) {
          const newData = response.data.map((item: any) => ({
            name: item.name,
            description: item.description,
            stargazers_count: item.stargazers_count
          }));
          setUserRepo(newData);
        } else {
          setUserRepo([]);
        }
      } catch (error) {
        setUserRepo([]);
      }
    }
  };

  return (
    <div style={{ width: '100%', margin: '2rem auto' }}>
      {users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        users.map((user, index) => (
          <Accordion
            key={user.id}
            expanded={expandedIndex === index}
            onChange={handleChange(index, user.login)}
            sx={{ backgroundColor: '#ffffff' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{user.login}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ ml: 2, boxShadow: 'none' }}>
              {expandedIndex === index && (
                <>
                  {userRepo.length > 0 ? (
                    userRepo.map((repo, i) => (
                      <Box
                        key={repo.name + i}
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: 2,
                          mb: i !== userRepo.length - 1 ? 2 : 0,
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {repo.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 'bold', mr: 0.5 }}>
                              {repo.stargazers_count}
                            </Typography>
                            <StarIcon sx={{ color: 'black' }} />
                          </Box>
                        </Box>

                        <Typography sx={{ mt: 1, textAlign: 'left' }}>
                          {repo.description}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No repo found!</Typography>
                  )}
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default UserAccordion;

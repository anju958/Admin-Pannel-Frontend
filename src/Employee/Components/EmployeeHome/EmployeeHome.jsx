
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import React from 'react';


function EmployeeHome() {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const user = JSON.parse(localStorage.getItem("user")); 

  const cards = [
    {
      id: 1,
      title: 'Total Projects',
      number: 0
    },
    {
      id: 2,
      title: 'Total Leaves',
      number: 0,
    },
    {
      id: 3,
      title: 'Pending Projects',
      number: 0
    },
  ];

  return (
    <div className="employee-home">
      <h1 className='employee-home-title'>
        Welcome to {user?.ename || "Employee"}
      </h1>

      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            className={`dashboard-card ${selectedCard === index ? 'active' : ''}`}
          >
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              sx={{
                height: '100%',
              }}
            >
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h5" component="div" className="dashboard-card-title">
                  {card.title}
                </Typography>
                <Typography variant="h3" className="dashboard-card-number">
                  {card.number}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  );
}

export default EmployeeHome;

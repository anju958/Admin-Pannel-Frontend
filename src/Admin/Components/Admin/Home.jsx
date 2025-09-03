
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import React from 'react';

function Admin() {
      const [selectedCard, setSelectedCard] = React.useState(0);
    const cards = [
  {
    id: 1,
    title: 'Total Employees',
    number:200,
  },
  {
    id: 2,
    title: 'Total Projects',
    number:23
  },
  {
    id: 3,
    title: 'Total Clients',
    number:300,
   
  },
    {
    id: 4,
    title: ' Pending Payments',
    number:20000
   
  },
    {
    id: 5,
    title: 'Jobs Opening',
    number:10
   
  },
  {
    id: 5,
    title: 'Jobs Opening',
    
  },
];
    return (
        <div className="p-4">
                    <h1 className='text-center p-3'>Welcome to Admin Dashboard</h1>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                            gap: 2,
                            
                        }}
                    >
                        {cards.map((card, index) => (
                            <Card>
                                <CardActionArea
                                    onClick={() => setSelectedCard(index)}
                                    data-active={selectedCard === index ? '' : undefined}
                                    sx={{
                                        height: '100%',
                                        '&[data-active]': {
                                            backgroundColor: 'action.selected',
                                            '&:hover': {
                                                backgroundColor: 'action.selectedHover',
                                            },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ height: '100%'  }}>
                                        <Typography variant="h5" component="div">
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" >
                                            {card.description}
                                            {card.number}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Box>
                </div>
    )
}

export default Admin

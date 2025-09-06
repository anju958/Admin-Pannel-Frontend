
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
    id: 2,
    title: 'Total Projects',
    number:0
  },
  {
    id: 3,
    title: 'Total Leaves',
    number:0,
   
  },
    {
    id: 4,
    title: 'Pending Projects',
    number:0
   
  },
];
    return (
        <div className="p-4">
                    <h1 className='text-center p-3'>Welcome to  {user?.ename || "Employee"}  </h1>
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

export default EmployeeHome
